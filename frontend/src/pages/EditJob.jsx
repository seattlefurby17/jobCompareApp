import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
  title: "",
  company: "",
  salary: "",
  bonus: "",
  stock_options: "",
  wellness_stipend: "",
  life_insurance: "",
  personal_dev_fund: ""
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching job:", err));
  }, [id]);

  function handleChange(e) {
    setJob({ ...job, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:4000/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job)
    })
      .then(res => res.json())
      .then(() => navigate("/"))
      .catch(err => console.error("Error updating job:", err));
  }

  if (loading) return <p>Loading job...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Job</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input name="title" value={job.title} onChange={handleChange} placeholder="Job Title" />
        <input name="company" value={job.company} onChange={handleChange} placeholder="Company" />
        <input name="salary" value={job.salary} onChange={handleChange} placeholder="Salary" />
        <input name="bonus" value={job.bonus} onChange={handleChange} placeholder="Bonus" />
        <input name="stock_options" value={job.stock_options} onChange={handleChange} placeholder="Stock Options" />
        <input name="wellness_stipend" value={job.wellness_stipend} onChange={handleChange} placeholder="Wellness Stipend" />
        <input name="life_insurance" value={job.life_insurance} onChange={handleChange} placeholder="Life Insurance" />
        <input name="personal_dev_fund" value={job.personal_dev_fund} onChange={handleChange} placeholder="Personal Dev Fund" />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
