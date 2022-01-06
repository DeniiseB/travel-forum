import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup.jsx";
import "./App.css";
import GroupProvider from "./contexts/GroupContext";

function App() {
  return (
    <div className="App">
      <GroupProvider>
        <Router>
          <Switch>
            <Route exact path="/create-group" component={CreateGroup} />
          </Switch>
        </Router>
      </GroupProvider>
    </div>
  );
}

export default App;
