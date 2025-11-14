
import { useEffect, useState } from "react";
import { api } from "../api";
import NewLeave from "./NewLeave";

export default function Dashboard() {
  const [leaves, setLeaves] = useState([]);

  
  const load = async () => {
    try {
      const res = await api.getMyLeaves();
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  
  const handleEdit = async (leave) => {
    const newReason = window.prompt(
      "Edit reason for this leave:",
      leave.reason || ""
    );
    if (newReason === null) return;

    try {
      await api.updateLeave(leave._id, { reason: newReason });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update leave");
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this leave request?")) return;

  try {
    await api.deleteLeave(id);
    await load();
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message || "Failed to delete leave"
    );
  }
};

 const handleDeleteAll = async () => {
  if (!window.confirm("Delete ALL your leave requests?")) return;

  try {
    await api.deleteMyLeaves();
    await load();
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message || "Failed to delete all requests"
    );
  }
};


  const renderStatusBadge = (status) => {
    const bg =
      status === "APPROVED"
        ? "#c6f6d5"
        : status === "REJECTED"
        ? "#feb2b2"
        : "#e2e8f0";
    const color =
      status === "APPROVED"
        ? "#22543d"
        : status === "REJECTED"
        ? "#742a2a"
        : "#2d3748";

    return (
      <span
        style={{
          backgroundColor: bg,
          color,
          padding: "4px 10px",
          borderRadius: "6px",
          fontWeight: "bold",
          marginLeft: "6px",
          marginRight: "6px",
          display: "inline-block",
          minWidth: "100px",
          textAlign: "center",
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>My Leave Requests</h2>

      {/* form for new leave */}
      <NewLeave onCreated={load} />

      {/* delete ALL button */}
      <button
        type="button"
        onClick={handleDeleteAll}
        style={{
          marginTop: "8px",
          marginBottom: "12px",
          backgroundColor: "#cc0000",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Delete All
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {leaves.map((l) => (
          <li key={l._id} style={{ marginBottom: "8px" }}>
     {new Date(l.startDate).toLocaleDateString("en-GB")} {" "}
{new Date(l.endDate).toLocaleDateString("en-GB")} ({l.type}){" "}

            {renderStatusBadge(l.status)}
            {l.reason && <strong> {l.reason}</strong>}
           <button
  onClick={() => handleEdit(l)}
  style={{
    backgroundColor: "orange",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    marginLeft: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  Edit
</button>

<button
  onClick={() => handleDelete(l._id)}
  style={{
    backgroundColor: "dodgerblue",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    marginLeft: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  Delete
</button>

          </li>
        ))}
      </ul>
    </div>
  );
}
