import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    salary: "",
    bonus: "",
    stock: "",
    wellness: "",
    life_insurance: "",
    pdf: ""
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => navigate("/jobs"))
      .catch(err => console.error("Error adding job:", err));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Job</h1>

      <form onSubmit={handleSubmit}>
        {Object.keys(form).map(key => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label>
              {key.replace("_", " ")}:
              <input
                type="text"
                value={form[key]}
                onChange={e => handleChange(key, e.target.value)}
                style={{ marginLeft: "0.5rem" }}
              />
            </label>
          </div>
        ))}

        <button type="submit">Save Job</button>
      </form>
    </div>
  );
}
