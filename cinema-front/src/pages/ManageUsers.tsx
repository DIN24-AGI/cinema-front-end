import React, { useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL"; // adjust if needed

const ManageUsers = () => {
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
        throw new Error(data.msg || "Failed to create user");
      }

      setMessage("User created successfully!");
      setEmail("");
      setPassword("");
      setRole("regular");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users</h2>

      {message && (
        <div
          className={`alert ${
            message.includes("successfully") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <form className="card p-4" onSubmit={handleCreateUser}>
        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
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
          <label className="form-label">Password</label>
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
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="regular">Regular</option>
            <option value="super">Super Admin</option>
          </select>
        </div>

        {/* Submit */}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default ManageUsers;
