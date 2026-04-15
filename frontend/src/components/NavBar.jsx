import { Link } from "react-router-dom";
import "../styles/NavBar.css";

export default function NavBar() {
  function toggleDarkMode() {
    document.body.classList.toggle("dark");
  }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/add">Add Job</Link>
        <Link to="/compare">Compare</Link>
        <Link to="/settings">Settings</Link>
      </div>

      <div className="right">
        <button className="secondary" onClick={toggleDarkMode}>
          Toggle Dark Mode
        </button>
      </div>
    </div>
  );
}
