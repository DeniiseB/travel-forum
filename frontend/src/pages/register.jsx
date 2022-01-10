import React from "react";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useHistory } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const { register } = useContext(UserContext);
  const history = useHistory();

  async function registerNewUser() {
    let user = {
      username: username,
      password: password,
    };
    let res = await register(user);
    if (res.status === 400) {
      setUsernameExists(true);
      setTimeout(function () {
        setUsernameExists(false);
      }, 8000);
    } else {
      console.log("User registered");
      history.push("/");
    }
    setUsername("");
    setPassword("");
  }

  return (
    <div className="registerWrapper" style={styles.resgisterWrapper}>
      <div className="container" style={styles.container}>
        <div className="name" style={styles.name}>
          <h5>Travel</h5>
        </div>
        <div className="inputs" style={styles.inputs}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={registerNewUser}>Register</button>

          <p
            className="warning"
            style={usernameExists ? styles.warning : styles.hide}
          >
            This username already exists
          </p>
        </div>
        <div className="login" style={styles.login}>
          <p>
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  resgisterWrapper: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#f1e7e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    width: "80%",
    height: "80%",
    display: "grid",
    gridTemplateRows: "25% 50% 25%",
    fontSize: "2em",
  },
  name: {
    borderBottom: "5px solid #f1e7e0",
  },
  inputs: {
    paddingTop: "5vh",
    display: "flex",
    flexDirection: "column",
    gap: "2vh",
    fontSize: "3em",
    width: "80%",
    alignItems: "center",
    marginLeft: "4vh",
    justifyContent: "center",
    borderBottom: "5px solid #f1e7e0",
  },
  login: {
    fontSize: "23px",
  },
  warning: {
    fontSize: "20px",
    color: "red",
    display: "block",
  },
  hide: {
    color: "white",
    fontSize: "20px",
  },
  success: {
    fontSize: "20px",
    color: "green",
    display: "block",
  },
};