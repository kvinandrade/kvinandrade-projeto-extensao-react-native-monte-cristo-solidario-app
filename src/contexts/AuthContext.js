import React, { createContext, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { initialUsers } from "../services/mockDatabase";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, senha) => {
    setLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = authService.login(users, email, senha);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return false;
    }

    setUser(result.user);
    setLoading(false);
    return true;
  };

  const logout = () => setUser(null);

  const createAdmin = (payload) => {
    if (!authService.canCreateAdmin(user)) {
      return { ok: false, message: "Apenas MASTER pode criar administradores." };
    }

    const result = authService.createAdmin(users, payload);
    if (result.ok) {
      setUsers((prev) => [result.newAdmin, ...prev]);
    }
    return result;
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === userId && item.role !== "MASTER"
          ? { ...item, ativo: !item.ativo }
          : item
      )
    );
  };

  const updatePermissions = (adminId, permissionKey) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === adminId && item.role !== "MASTER"
          ? {
              ...item,
              permissions: {
                ...item.permissions,
                [permissionKey]: !item.permissions?.[permissionKey],
              },
            }
          : item
      )
    );
  };

  const value = useMemo(
    () => ({
      users,
      user,
      loading,
      error,
      login,
      logout,
      createAdmin,
      toggleUserStatus,
      updatePermissions,
      isMaster: user?.role === "MASTER",
    }),
    [users, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
