import { ADMIN_PERMISSIONS, createUser, USER_ROLES } from "../models/userModel";

export const authService = {
  login(users, email, senha) {
    const user = users.find(
      (item) =>
        item.email.toLowerCase() === String(email).toLowerCase() &&
        item.senha === senha &&
        item.ativo
    );

    if (!user) {
      return { ok: false, message: "Credenciais invalidas." };
    }

    return { ok: true, user };
  },

  canCreateAdmin(loggedUser) {
    return loggedUser?.role === USER_ROLES.MASTER;
  },

  createAdmin(users, payload) {
    const adminCount = users.filter((item) => item.role === USER_ROLES.ADMIN).length;
    if (adminCount >= 5) {
      return { ok: false, message: "Limite de 5 administradores atingido." };
    }

    const exists = users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) {
      return { ok: false, message: "Ja existe usuario com esse e-mail." };
    }

    const newAdmin = createUser({
      id: `u-${Date.now()}`,
      nome: payload.nome,
      email: payload.email,
      senha: payload.senha,
      role: USER_ROLES.ADMIN,
      permissions: payload.permissions || ADMIN_PERMISSIONS,
      ativo: true,
    });

    return { ok: true, newAdmin };
  },
};
