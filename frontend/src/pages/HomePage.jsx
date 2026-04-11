import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/HomePage.css";


export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card two-col">
          <div>
            <h1 className="page-title">JobCompare</h1>
              <p className="home-subtitle">
                Compare job offers, adjust scoring weights, and manage your job list.
              </p>
          </div>

          <div className="button-stack">
            <button className="primary" onClick={() => navigate("/jobs")}>
              View Job List
            </button>

            <button className="primary" onClick={() => navigate("/add")}>
              Add New Job
            </button>

            <button className="primary" onClick={() => navigate("/compare")}>
              Compare Jobs
            </button>

            <button className="secondary" onClick={() => navigate("/settings")}>
              Settings
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
