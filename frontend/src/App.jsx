import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobsListPage from "./pages/JobsListPage";
import EditJobPage from "./pages/EditJobPage";
import ComparePage from "./pages/ComparePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobsListPage />} />
        <Route path="/edit/:id" element={<EditJobPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
