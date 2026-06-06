import { isOlderThanDays } from "../utils/dateUtils";
import { normalizeText } from "../utils/formatters";

const onlyDigits = (value = "") => String(value).replace(/\D/g, "");

const normalizeAddress = (value = "") => normalizeText(value).replace(/\s+/g, " ").trim();

const hasValidCpf = (cpf) => {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcDigit = (slice, factor) => {
    let total = 0;
    for (let i = 0; i < slice.length; i += 1) {
      total += Number(slice[i]) * (factor - i);
    }
    const mod = (total * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const d1 = calcDigit(digits.slice(0, 9), 10);
  const d2 = calcDigit(digits.slice(0, 10), 11);
  return d1 === Number(digits[9]) && d2 === Number(digits[10]);
};

const hasValidPhone = (phone) => {
  const digits = onlyDigits(phone);
  return digits.length === 10 || digits.length === 11;
};

const normalizeAllowedNeighborhoods = (items = []) => {
  const fromConfig = Array.isArray(items) ? items : [];
  const withDefault = [...fromConfig, "Monte Cristo"];
  const map = new Map();

  withDefault.forEach((item) => {
    const raw = String(item || "").trim();
    if (!raw) return;
    const key = normalizeText(raw);
    if (!map.has(key)) {
      map.set(key, raw);
    }
  });

  return Array.from(map.values());
};

const cpfDisplay = (cpf = "") => {
  const d = onlyDigits(cpf).slice(0, 11);
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
};

const promoteFromWaiting = (familias) => {
  const oldest = familias
    .filter((f) => f.status === "espera")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
  if (!oldest) return familias;
  return familias.map((f) =>
    f.id === oldest.id ? { ...f, status: "ativo", promotedAt: new Date().toISOString() } : f
  );
};

export const familiaService = {
  applyAutoInactive(familias) {
    return familias.map((family) => {
      if (family.status === "inativo" || family.status === "excluido") return family;
      if (isOlderThanDays(family.lastWithdrawalAt, 30)) {
        return { ...family, status: "inativo" };
      }
      return family;
    });
  },

  search(familias, query) {
    const term = normalizeText(query);
    if (!term) return familias;

    return familias.filter((family) => {
      const byName = normalizeText(family.nome).includes(term);
      const byCpf = String(family.cpf).replace(/\D/g, "").includes(term.replace(/\D/g, ""));
      return byName || byCpf;
    });
  },

  validateForSave(familias, familyPayload, allowedNeighborhoods = ["Monte Cristo"]) {
    const nome = String(familyPayload?.nome || "").trim();
    const cpf = onlyDigits(familyPayload?.cpf).slice(0, 11);
    const telefone = onlyDigits(familyPayload?.telefone);
    const logradouro = String(familyPayload?.logradouro || "").trim();
    const numero = String(familyPayload?.numero || "").trim();
    const bairro = String(familyPayload?.bairro || "").trim();
    const id = familyPayload?.id || null;

    if (!nome) return { ok: false, field: "nome", message: "Nome é obrigatório." };
    if (!cpf) return { ok: false, field: "cpf", message: "CPF é obrigatório." };
    if (!telefone) return { ok: false, field: "telefone", message: "Telefone é obrigatório." };
    if (!logradouro) return { ok: false, field: "logradouro", message: "Rua/Avenida é obrigatória." };
    if (!numero) return { ok: false, field: "numero", message: "Número da residência é obrigatório." };
    if (!bairro) return { ok: false, field: "bairro", message: "Bairro é obrigatório." };

    if (!hasValidCpf(cpf)) {
      return { ok: false, field: "cpf", message: "CPF inválido. Verifique os 11 dígitos informados." };
    }

    if (!hasValidPhone(telefone)) {
      return {
        ok: false,
        field: "telefone",
        message: "Telefone inválido. Informe DDD + número com 10 ou 11 dígitos.",
      };
    }

    const allowed = normalizeAllowedNeighborhoods(allowedNeighborhoods);
    const normalizedBairro = normalizeText(bairro);
    const isAllowed = allowed.some((item) => normalizeText(item) === normalizedBairro);
    if (!isAllowed) {
      return {
        ok: false,
        field: "bairro",
        message: `Bairro não permitido. Permitidos: ${allowed.join(", ")}.`,
      };
    }

    const duplicateByCpf = familias.find(
      (family) => family.id !== id && onlyDigits(family.cpf) === cpf
    );
    if (duplicateByCpf) {
      return {
        ok: false,
        field: "cpf",
        message: `CPF já cadastrado — ${duplicateByCpf.nome} (CPF: ${cpfDisplay(duplicateByCpf.cpf)})`,
        duplicate: duplicateByCpf,
      };
    }

    const normalizedNum = normalizeText(numero);
    const normalizedRua = normalizeAddress(logradouro);
    const duplicateByAddress = familias.find((family) => {
      if (family.id === id) return false;
      const sameRua = normalizeAddress(family.logradouro || family.endereco) === normalizedRua;
      const sameNum = normalizeText(String(family.numero || "")) === normalizedNum;
      const sameBairro = normalizeText(family.bairro || "") === normalizedBairro;
      return sameRua && sameNum && sameBairro;
    });
    if (duplicateByAddress) {
      return {
        ok: false,
        field: "logradouro",
        message: `Endereço já cadastrado — ${duplicateByAddress.nome} (CPF: ${cpfDisplay(duplicateByAddress.cpf)})`,
        duplicate: duplicateByAddress,
      };
    }

    const endereco = `${logradouro}, ${numero}`;
    return { ok: true, payload: { ...familyPayload, nome, cpf, telefone, logradouro, numero, endereco, bairro } };
  },

  upsert(familias, familyPayload, vagasTotais = Infinity) {
    const cpf = onlyDigits(familyPayload.cpf).slice(0, 11);
    const telefone = onlyDigits(familyPayload.telefone);
    const logradouro = String(familyPayload.logradouro || "").trim();
    const numero = String(familyPayload.numero || "").trim();
    const endereco = logradouro ? `${logradouro}, ${numero}`.trim() : (familyPayload.endereco || "");

    if (familyPayload.id && familias.some((family) => family.id === familyPayload.id)) {
      return familias.map((family) =>
        family.id === familyPayload.id
          ? { ...family, ...familyPayload, cpf, telefone, logradouro, numero, endereco }
          : family
      );
    }

    const activeCount = familias.filter((f) => f.status === "ativo").length;
    const derivedStatus = activeCount >= vagasTotais ? "espera" : (familyPayload.status || "ativo");

    const newFamily = {
      ...familyPayload,
      id: `f-${Date.now()}`,
      cpf,
      telefone,
      logradouro,
      numero,
      endereco,
      status: derivedStatus,
      lastWithdrawalAt: familyPayload.lastWithdrawalAt || null,
      createdById: familyPayload.createdById || null,
      createdByName: familyPayload.createdByName || "Sistema",
      createdAt: familyPayload.createdAt || new Date().toISOString(),
    };

    return [newFamily, ...familias];
  },

  reactivate(familias, familyId) {
    return familias.map((family) =>
      family.id === familyId ? { ...family, status: "ativo" } : family
    );
  },

  inactivate(familias, familyId) {
    const updated = familias.map((family) =>
      family.id === familyId ? { ...family, status: "inativo" } : family
    );
    return promoteFromWaiting(updated);
  },

  softDelete(familias, familyId) {
    const updated = familias.map((family) =>
      family.id === familyId
        ? { ...family, status: "excluido", excludedAt: new Date().toISOString() }
        : family
    );
    return promoteFromWaiting(updated);
  },

  restore(familias, familyId) {
    return familias.map((family) =>
      family.id === familyId
        ? { ...family, status: "inativo", excludedAt: null }
        : family
    );
  },
};
