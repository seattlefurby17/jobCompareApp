import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobsList from "./pages/JobsList";
import EditJob from "./pages/EditJob";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobsList />} />
        <Route path="/edit/:id" element={<EditJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
