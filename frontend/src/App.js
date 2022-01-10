import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup.jsx";
import Group from "./pages/Group.jsx";
import GroupProvider from "./contexts/GroupContext";

function App() {
  return (
    <div className="App">
      <GroupProvider>
        <Router>
          <Switch>
            <Route exact path="/create-group" component={CreateGroup} />
            <Route exact path="/group/:groupid" component={Group} />
          </Switch>
        </Router>
      </GroupProvider>
    </div>
  );
}

export default App;
