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
            {new Date(l.startDate).toLocaleDateString()} -{" "}
            {new Date(l.endDate).toLocaleDateString()} ({l.type}) –{" "}
            <strong>{l.status}</strong> – {l.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
