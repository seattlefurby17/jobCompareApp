import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import "./styles/layout.css";
import HomePage from "./pages/HomePage";
import JobsListPage from "./pages/JobsListPage";
import EditJobPage from "./pages/EditJobPage";
import ComparePage from "./pages/ComparePage";
import SettingsPage from "./pages/SettingsPage";
import AddJobPage from "./pages/AddJobPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/add" element={<AddJobPage />} />
        <Route path="/edit/:id" element={<EditJobPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
