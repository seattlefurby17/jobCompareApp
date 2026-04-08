import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h1>JobCompare</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Compare job offers, adjust scoring weights, and manage your job list.
      </p>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "300px",
        margin: "0 auto"
      }}>
        <button onClick={() => navigate("/jobs")}>
          View Job List
        </button>

        <button onClick={() => navigate("/add")}>
          Add New Job
        </button>

        <button onClick={() => navigate("/compare")}>
          Compare Jobs
        </button>

        <button onClick={() => navigate("/settings")}>
          Settings
        </button>
      </div>
    </div>
  );
}
