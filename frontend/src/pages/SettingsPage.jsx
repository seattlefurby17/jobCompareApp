import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/JobForm.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  if (!settings) {
    return (
      <>
        <NavBar />
        <div className="page settings-page">
          <p>Loading settings...</p>
        </div>
      </>
    );
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSave = () => {
    setSaving(true);
    setSaved(false);

    fetch("http://localhost:4000/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    })
      .then(res => res.json())
      .then(() => {
        setSaving(false);
        setSaved(true);
      })
      .catch(err => {
        console.error("Error saving settings:", err);
        setSaving(false);
      });
  };

  return (
    <>
      <NavBar />

      <div className="page settings-page">
        <div className="card">
          <h1 className="page-title">Settings</h1>
          <p>Adjust the weights used when comparing jobs.</p>

          <div className="form-grid">
            {Object.keys(settings).map(key =>
              key !== "id" && (
                <div key={key} className="form-row">
                  <label>{key.replace(/_/g, " ")}</label>
                  <input
                    type="number"
                    value={settings[key]}
                    onChange={e => handleChange(key, e.target.value)}
                  />
                </div>
              )
            )}
          </div>

          <div className="form-buttons">
            <button
              className="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              className="secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>

          {saved && <p className="success-text">Settings saved!</p>}
        </div>
      </div>

      <Footer />
    </>
  );
}
