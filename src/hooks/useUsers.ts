import { useMemo } from "react";
import { useData } from "../context/DataContext";
import { User, RolePermissions } from "../types";

export function useUsers() {
  const { data, addUser, updateUser, deleteUser, updateRolePermissions, updateUserPermissions } = useData();

  const stats = useMemo(() => {
    const total = data.users.length;
    const admins = data.users.filter((u) => u.role === "admin").length;
    const vendors = data.users.filter((u) => u.role === "vendor").length;
    const active = data.users.filter((u) => u.status === "active").length;
    const inactive = total - active;
    return { total, admins, vendors, active, inactive };
  }, [data.users]);

  const createUser = (userData: Omit<User, "id">) => {
    addUser(userData as User);
  };

  const updateUserData = (id: number, userData: Partial<User>) => {
    updateUser(id, userData);
  };

  const removeUser = (id: number) => {
    deleteUser(id);
  };

  const toggleUserStatus = (id: number) => {
    const user = data.users.find((u) => u.id === id);
    if (user) {
      updateUser(id, { status: user.status === "active" ? "inactive" : "active" });
    }
  };

  const setUserPermissions = (id: number, permissions: RolePermissions) => {
    updateUserPermissions(id, permissions);
  };

  const updateDefaultRolePermissions = (permissions: RolePermissions) => {
    updateRolePermissions(permissions);
  };

  return {
    users: data.users,
    stats,
    createUser,
    editUser: updateUserData,
    removeUser,
    toggleUserStatus,
    setUserPermissions,
    updateDefaultRolePermissions,
  };
}