import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import JobForm from "../components/JobForm";
import "../styles/JobForm.css";

export default function EditJobPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error("Error loading job:", err));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:4000/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job)
    })
      .then(res => res.json())
      .then(() => navigate("/jobs"))
      .catch(err => console.error("Error updating job:", err));
  }

  if (!job) return <p>Loading...</p>;

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">
          <h1>Edit Job</h1>

          <JobForm
            job={job}
            setJob={setJob}
            onSubmit={handleSubmit}
            mode="edit"
            onCancel={() => navigate("/jobs")}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
