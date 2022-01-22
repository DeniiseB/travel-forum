import React from "react";
import { Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useHistory } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [badCredentials, setBadCredentials] = useState(false);
  const [tooManyAttempts, setTooManyAttempts] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const { login } = useContext(UserContext);
  const history = useHistory();

  async function loginUser() {
    let credentials = {
      username: username,
      password: password,
    };
    let res = await login(credentials);

    if (res.status === 200) {
      history.push("/");
    } else if (res.status === 500) {
      setTooManyAttempts(true);
      setTimeout(function () {
        setTooManyAttempts(false);
      }, 5000);
    } else if (res.status === 403) {
      setBlocked(true);
      setTimeout(function () {
        setBlocked(false);
      }, 5000);
    } else {
      setBadCredentials(true);
      setTimeout(function () {
        setBadCredentials(false);
      }, 5000);
    }
    setUsername("");
    setPassword("");
  }

  return (
    <div className="loginWrapper" style={styles.loginWrapper}>
      <div className="container" style={styles.container}>
        <div className="inputs" style={styles.inputs}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <Button
            onClick={loginUser}
            style={styles.button}
            disabled={tooManyAttempts}
          >
            Log in
          </Button>

          <p
            className="warning"
            style={badCredentials ? styles.warning : styles.hide}
          >
            Bad credentials
          </p>

          <p
            className="warning"
            style={tooManyAttempts ? styles.attempts : styles.unvisable}
          >
            Too many attempts, please try again later
          </p>
          <p
            className="warning"
            style={blocked ? styles.attempts : styles.unvisable}
          >
            Your account has been blocked by administrators
          </p>
        </div>

        <div className="register" style={styles.register}>
          <p>
            Not a member yet? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

const styles = {
  loginWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  container: {
    display: "grid",
    gridTemplateRows: "60% 40%",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: "2vh",
    fontSize: "1.5em",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: "5px",
    border: "none",
    padding: "4px",
  },
  button: {
    fontSize: "20px",
    width: "38%",
  },
  warning: {
    fontSize: "20px",
    color: "red",
    display: "block",
    padding: "2vh",
  },
  hide: {
    color: "#f1e7e0",
    fontSize: "20px",
  },
  unvisable: {
    display: "none",
  },
  attempts: {
    position: "fixed",
    right: "45px",
    bottom: "100px",
    color: "white",
    fontSize: "15px",
    backgroundColor: "red",
    padding: "3px",
    borderRadius: "5px",
    opacity: "0.7",
  },
};
