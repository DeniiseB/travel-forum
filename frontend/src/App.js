import './App.css';
import InsideCategory from './pages/InsideCategory';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/inside-category" component={InsideCategory} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


