
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import UserContextProvider from './contexts/UserContext';


function App() {
  return (
    <div className="App">
        <UserContextProvider>
      <Router>
        <main>
          <Switch>
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </main>
        </Router>
        </UserContextProvider>
    </div>
  );
}

export default App;
