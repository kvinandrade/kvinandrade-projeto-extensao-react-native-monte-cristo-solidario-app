export const createUser = ({ id, nome, email, senha, role, permissions, ativo = true }) => ({
  id,
  nome,
  email,
  senha,
  role,
  permissions,
  ativo,
});

export const USER_ROLES = {
  MASTER: "MASTER",
  ADMIN: "ADMIN",
};

export const ADMIN_PERMISSIONS = {
  cadastrar: true,
  editar: true,
  visualizar: true,
  gerarListas: true,
};
