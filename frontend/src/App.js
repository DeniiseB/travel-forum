

import Login from './pages/Login';
import Register from './pages/Register';
import UserContextProvider from './contexts/UserContext';
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup.jsx";
import "./App.css";
import GroupProvider from "./contexts/GroupContext";

function App() {
  return (
    <div className="App">
  <UserContextProvider>
        <GroupProvider>
        <Navbar />
        <Router>
          <main>
            <Switch>
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
            <Route path="/" exact component={Home} />
             <Route exact path="/create-group" component={CreateGroup} />
            </Switch>
          </main>
      </Router>
      </GroupProvider>
      </UserContextProvider>
    </div>
  );
}


export default App;
