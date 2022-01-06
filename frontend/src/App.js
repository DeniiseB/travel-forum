import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup.jsx";
import "./App.css";
import GroupProvider from "./contexts/GroupContext";

function App() {
  return (
    <div className="App">
      <GroupProvider>
        <Router>
          <Routes>
            <Route exact path="/create-group" element={CreateGroup()} />
          </Routes>
        </Router>
      </GroupProvider>
    </div>
  );
}

export default App;
