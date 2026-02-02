import { useState } from "react";
import API from "../api";

export default function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      // auto-login after register
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="authForm">
      <h2>Register</h2>
      <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
