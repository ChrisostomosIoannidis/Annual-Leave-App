import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"

  // login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register state
  const [nameReg, setNameReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.login(email, password);
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.register(nameReg, emailReg, passwordReg);
      setMessage("Registered! You can now log in.");
      setMode("login");
      setEmail(emailReg);
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h1>Annual Leave App</h1>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setMode("login")}
          disabled={mode === "login"}
          style={{ marginRight: 8 }}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          disabled={mode === "register"}
        >
          Register
        </button>
      </div>

      {mode === "login" && (
        <>
          <h2>Login</h2>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </>
      )}

      {mode === "register" && (
        <>
          <h2>Register</h2>
          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <input
              placeholder="Full name"
              value={nameReg}
              onChange={(e) => setNameReg(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={emailReg}
              onChange={(e) => setEmailReg(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordReg}
              onChange={(e) => setPasswordReg(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </form>
        </>
      )}

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
