import "../styles/JobForm.css";

export default function JobForm({ job, setJob, onSubmit, mode = "add" }) {
  function handleChange(e) {
    const { name, value } = e.target;

    const processedValue =
      name === "is_current_job" ? Number(value) : value;

    setJob(prev => ({ ...prev, [name]: processedValue }));
  }

  return (
    <form onSubmit={onSubmit} className="two-col jobform">

      {/* LOCATION */}
      <h2 className="section-header">Location</h2>
      <hr className="divider" />

      <label>Job Title</label>
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

      {/* COMPENSATION */}
      <h2 className="section-header">Compensation</h2>
      <hr className="divider" />

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

      {/* BENEFITS */}
      <h2 className="section-header">Benefits</h2>
      <hr className="divider" />

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

      <label>Personal Development Fund</label>
      <input
        name="personal_dev_fund"
        value={job.personal_dev_fund}
        onChange={handleChange}
      />

      {/* OTHER */}
      <h2 className="section-header">Other</h2>
      <hr className="divider" />

      <label>Is Current Job</label>
      <select
        name="is_current_job"
        value={job.is_current_job}
        onChange={handleChange}
      >
        <option value={0}>No</option>
        <option value={1}>Yes</option>
      </select>

      {/* BUTTONS */}
      <div className="jobform-buttons">
        <button type="submit" className="primary">
          {mode === "add" ? "Add Job" : "Save Changes"}
        </button>

        <button
          type="button"
          className="secondary"
          onClick={job.onCancel}
        >
          Cancel
        </button>
      </div>

    </form>
  );
}
