import './App.css';
import InsideCategory from './pages/InsideCategory';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/inside-category" component={InsideCategory} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;


