import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
          <Route exact path="/create-group" element={CreateGroup()} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
