import React, { useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL"; 
import UserList from "../components/UserList"
import { useTranslation } from "react-i18next";

const ManageUsers = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"regular" | "super">("regular");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_ENDPOINTS.users}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

         },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || t("manageUsers.createError"));
      }

      setMessage(t("manageUsers.success"));
      setEmail("");
      setPassword("");
      setRole("regular");
    } catch (err: any) {
      setMessage(err.message || t("manageUsers.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{t("manageUsers.title")}</h2>

      {message && (
        <div
          className={`alert ${
            message.includes(t("manageUsers.successKeyword")) ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <form className="card p-4" onSubmit={handleCreateUser}>
        {/* Email */}
        <div className="mb-3">
          <label className="form-label">{t("manageUsers.email")}</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">{t("manageUsers.password")}</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="form-label">{t("manageUsers.role")}</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
           <option value="regular">{t("roles.regular")}</option>
            <option value="super">{t("roles.super")}</option>
          </select>
        </div>

        {/* Submit */}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? t("manageUsers.loading") : t("manageUsers.create")}
        </button>
      </form>
      <UserList />

    </div>

  );
};

export default ManageUsers;
