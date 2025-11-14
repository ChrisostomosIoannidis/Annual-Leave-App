
import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminPanel() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const res = await api.getAllLeaves();
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load leaves");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.updateLeaveStatus(id, status);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Admin Panel – All Leave Requests</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {leaves.length === 0 && !error && <p>No leave requests yet.</p>}

      <ul>
        {leaves.map((l) => (
          <li key={l._id}>
            {l.user?.name} ({l.user?.email}) –{" "}
            {new Date(l.startDate).toLocaleDateString()} -{" "}
            {new Date(l.endDate).toLocaleDateString()} ({l.type}) –{" "}
            <strong>{l.status}</strong> – {l.reason}{" "}
            {l.status === "PENDING" && (
              <>
                <button onClick={() => updateStatus(l._id, "APPROVED")}>
                  Approve
                </button>
                <button onClick={() => updateStatus(l._id, "REJECTED")}>
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
