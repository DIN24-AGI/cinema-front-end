import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";
import type { User } from "../types/cinemaTypes"
import { useTranslation } from "react-i18next";


const UserList = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.users, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (uid: string, role: string) => {
    const confirm = window.confirm(
      t("users.confirmRole", { role })
    );
    if (!confirm) return;

    try {
      await fetch(`${API_ENDPOINTS.users}/${uid}`, {
        method: "PUT",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const deleteUser = async (uid: string) => {
    const confirm = window.confirm(
      t("users.deleteUser")

    );
    if (!confirm) return;
    try {
      await fetch(`${API_ENDPOINTS.users}/${uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer: ${token}`}
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  if (loading) return <p>{t("loading.users")}</p>;

  return (
    <div className="mt-4">
      <h3>{t("users.title")}</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>{t("users.email")}</th>
            <th>{t("users.role")}</th>
            <th>{t("users.changeRole")}</th>
            <th>{t("users.delete")}</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td>{u.email}</td>
              <td>{t(`roles.${u.role}`)}</td>

              <td>
                <select
                  className="form-select"
                  value={u.role}
                  onChange={(e) => updateRole(u.uid, e.target.value)}
                >
                  <option value="regular">{t("roles.regular")}</option>
                  <option value="super">{t("roles.super")}</option>
                </select>
              </td>

              <td>
                <button
                  onClick={() => deleteUser(u.uid)}
                  className="btn btn-danger btn-sm"
                >
                  {t("users.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
