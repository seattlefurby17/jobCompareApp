import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  if (!settings) return <p>Loading settings...</p>;

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
    <div style={{ padding: "2rem" }}>
      <h1>Settings</h1>
      <p>Adjust the weights used when comparing jobs.</p>

      <div style={{ maxWidth: "400px" }}>
        {Object.keys(settings).map(key => (
          key !== "id" && (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label>
                <strong>{key.replace("_", " ")}:</strong>
                <input
                  type="number"
                  value={settings[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  style={{ marginLeft: "0.5rem", width: "80px" }}
                />
              </label>
            </div>
          )
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{ padding: "0.5rem 1rem" }}
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>

      {saved && <p style={{ color: "green" }}>Settings saved!</p>}
    </div>
  );
}
