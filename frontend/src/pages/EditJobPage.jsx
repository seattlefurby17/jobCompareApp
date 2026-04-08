import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    city: "",
    state: "",
    cost_of_living_index: "",
    salary: "",
    bonus: "",
    stock_options: "",
    wellness_stipend: "",
    life_insurance: "",
    personal_dev_fund: "",
    is_current_job: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        setJob({
          title: data.title || "",
          company: data.company || "",
          city: data.city || "",
          state: data.state || "",
          cost_of_living_index: data.cost_of_living_index || "",
          salary: data.salary || "",
          bonus: data.bonus || "",
          stock_options: data.stock_options || "",
          wellness_stipend: data.wellness_stipend || "",
          life_insurance: data.life_insurance || "",
          personal_dev_fund: data.personal_dev_fund || "",
          is_current_job: data.is_current_job || 0
        });
        setLoading(false);
      })
      .catch(err => console.error("Error fetching job:", err));
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
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

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxWidth: "600px"
        }}
      >
        <label>Title</label>
        <input name="title" value={job.title} onChange={handleChange} />

        <label>Company</label>
        <input name="company" value={job.company} onChange={handleChange} />

        <label>City</label>
        <input name="city" value={job.city} onChange={handleChange} />

        <label>State</label>
        <input name="state" value={job.state} onChange={handleChange} />

        <label>Cost of Living Index</label>
        <input
          name="cost_of_living_index"
          value={job.cost_of_living_index}
          onChange={handleChange}
        />

        <label>Salary</label>
        <input name="salary" value={job.salary} onChange={handleChange} />

        <label>Bonus</label>
        <input name="bonus" value={job.bonus} onChange={handleChange} />

        <label>Stock Options</label>
        <input
          name="stock_options"
          value={job.stock_options}
          onChange={handleChange}
        />

        <label>Wellness Stipend</label>
        <input
          name="wellness_stipend"
          value={job.wellness_stipend}
          onChange={handleChange}
        />

        <label>Life Insurance</label>
        <input
          name="life_insurance"
          value={job.life_insurance}
          onChange={handleChange}
        />

        <label>Personal Dev Fund</label>
        <input
          name="personal_dev_fund"
          value={job.personal_dev_fund}
          onChange={handleChange}
        />

        <label>Is Current Job</label>
        <select
          name="is_current_job"
          value={job.is_current_job}
          onChange={handleChange}
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>

        <button
          type="submit"
          style={{ gridColumn: "1 / span 2", marginTop: "1rem" }}
        >
          Save Changes
        </button>
      </form>

      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "1.5rem", display: "inline-block" }}
      >
        Back to Jobs
      </button>
    </div>
  );
}
