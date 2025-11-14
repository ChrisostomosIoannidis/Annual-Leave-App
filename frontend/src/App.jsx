import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

function InnerApp() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("dashboard");

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div style={{ padding: 24 }}>
      <header
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <strong>
          Logged in as: {user.name} ({user.role})
        </strong>
        <button onClick={() => setView("dashboard")}>My Leaves</button>
        {user.role === "admin" && (
          <button onClick={() => setView("admin")}>Admin Panel</button>
        )}
        <button onClick={logout}>Logout</button>
      </header>

      {view === "dashboard" && <Dashboard />}
      {view === "admin" && user.role === "admin" && <AdminPanel />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
