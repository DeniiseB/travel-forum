
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
            <Route path="/register" exact component={register} />
            <Route path="/login" exact component={login} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
