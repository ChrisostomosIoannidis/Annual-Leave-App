
import { useEffect, useState } from "react";
import { api } from "../api";
import NewLeave from "./NewLeave";

export default function Dashboard() {
  const [leaves, setLeaves] = useState([]);

  const load = async () => {
    const res = await api.getMyLeaves();
    setLeaves(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>My Leave Requests</h2>
      <NewLeave onCreated={load} />
<ul>
  {leaves.map((l) => (
    <li key={l._id}>
      {new Date(l.startDate).toLocaleDateString()} –{" "}
      {new Date(l.endDate).toLocaleDateString()} ({l.type}){" "}
      
      <span
        style={{
          backgroundColor:
            l.status === "APPROVED" ? "#c6f6d5" :
            l.status === "REJECTED" ? "#feb2b2" :
            "#e2e8f0",
          color:
            l.status === "APPROVED" ? "#22543d" :
            l.status === "REJECTED" ? "#742a2a" :
            "#2d3748",
          padding: "4px 10px",
          borderRadius: "6px",
          fontWeight: "bold",
          marginLeft: "6px",
          marginRight: "6px",
          display: "inline-block"
        }}
      >
        {l.status}
      </span>

     {l.reason && <strong>{l.reason}</strong>}

    </li>
  ))}
</ul>

    </div>
  );
}
