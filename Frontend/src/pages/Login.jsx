import { useState } from "react";
import API from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user); // tell App.jsx user is logged in
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="authForm">
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
