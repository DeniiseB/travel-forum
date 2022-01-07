
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import login from './pages/login';
import register from './pages/register';


function App() {
  return (
    <div className="App">
      <Router>
        <main>
          <Switch>
            <Route path="/" exact component={register} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
