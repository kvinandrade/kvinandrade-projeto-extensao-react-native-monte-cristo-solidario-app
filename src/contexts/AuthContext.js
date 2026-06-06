import React, { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { initialUsers } from "../services/mockDatabase";
import { firebaseAdapter } from "../services/firebaseAdapter";
import { usersDataStore } from "../services/usersDataStore";

export const AuthContext = createContext(null);

const ensureMasterUser = (list = []) => {
  const master = initialUsers.find((item) => item.role === "MASTER");
  if (!master) return list;
  const withoutMaster = list.filter((item) => item.role !== "MASTER");
  return [master, ...withoutMaster];
};

const syncUsersToFirebase = async (list = []) => {
  if (!firebaseAdapter.init()) return;
  await Promise.all(
    list.map((item) =>
      firebaseAdapter.setUser(item.id, item).catch((error) => {
        console.warn("Erro ao sincronizar usuário no Firebase:", error);
      })
    )
  );
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [usersReady, setUsersReady] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const hydrateUsers = async () => {
      const localUsers = await usersDataStore.load();
      let nextUsers = ensureMasterUser(localUsers?.length ? localUsers : initialUsers);

      if (firebaseAdapter.init()) {
        try {
          const remoteUsersMap = await firebaseAdapter.getAllUsers();
          const remoteUsers = Object.values(remoteUsersMap || {});
          if (remoteUsers.length > 0) {
            nextUsers = ensureMasterUser(remoteUsers);
          } else {
            await syncUsersToFirebase(nextUsers);
          }
        } catch (syncError) {
          console.warn("Usuários remotos indisponíveis:", syncError);
        }
      }

      if (active) {
        setUsers(nextUsers);
        setUsersReady(true);
      }
    };

    hydrateUsers();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!usersReady) return;
    usersDataStore.save(users);
    syncUsersToFirebase(users);
  }, [users, usersReady]);

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

    firebaseAdapter.init();
    Promise.resolve()
      .then(() => firebaseAdapter.authenticate(email, senha))
      .then(() => firebaseAdapter.ensureUserProfile(result.user))
      .then(() => firebaseAdapter.getAllUsers())
      .then((remoteUsersMap) => {
        const remoteUsers = Object.values(remoteUsersMap || {});
        if (remoteUsers.length > 0) {
          setUsers(ensureMasterUser(remoteUsers));
        }
      })
      .catch((syncError) => {
        console.warn("Sincronização Firebase após login:", syncError);
      });

    return true;
  };

  const logout = () => {
    firebaseAdapter.logout();
    setUser(null);
  };

  const createAdmin = (payload) => {
    if (!authService.canCreateAdmin(user)) {
      return { ok: false, message: "Apenas MASTER pode criar administradores." };
    }

    const result = authService.createAdmin(users, payload);
    if (result.ok) {
      setUsers((prev) => [result.newAdmin, ...prev]);
      firebaseAdapter.setUser(result.newAdmin.id, result.newAdmin).catch((syncError) => {
        console.warn("Erro ao salvar novo administrador no Firebase:", syncError);
      });
    }
    return result;
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) => {
      const next = prev.map((item) =>
        item.id === userId && item.role !== "MASTER"
          ? { ...item, ativo: !item.ativo }
          : item
      );
      const changed = next.find((item) => item.id === userId);
      if (changed) {
        firebaseAdapter.updateUser(userId, { ativo: changed.ativo }).catch((syncError) => {
          console.warn("Erro ao atualizar status do usuário no Firebase:", syncError);
        });
      }
      return next;
    });
  };

  const updatePermissions = (adminId, permissionKey) => {
    setUsers((prev) => {
      const next = prev.map((item) =>
        item.id === adminId && item.role !== "MASTER"
          ? {
              ...item,
              permissions: {
                ...item.permissions,
                [permissionKey]: !item.permissions?.[permissionKey],
              },
            }
          : item
      );
      const changed = next.find((item) => item.id === adminId);
      if (changed) {
        firebaseAdapter.updateUser(adminId, { permissions: changed.permissions }).catch((syncError) => {
          console.warn("Erro ao atualizar permissões no Firebase:", syncError);
        });
      }
      return next;
    });
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
