import React from "react";
import { Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useHistory } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [passwordMismatch, setPasswordMismatch]=useState(false)
  const { register, login } = useContext(UserContext);
  const history = useHistory();

  async function registerNewUser() {

    if (confirmPassword === password) {
      let user = {
        username: username,
        password: password
      };
      let res = await register(user);
      if (res.status === 400) {
        setUsernameExists(true);
        setTimeout(function () {
          setUsernameExists(false);
        }, 5000);
      } else {
        console.log("User registered");
        history.push("/");
        await login(user);
      }
      setUsername("");
      setPassword("");
      setConfirmPassword("")
    }
    else {
      setPasswordMismatch(true)
       setTimeout(function () {
         setPasswordMismatch(false);
       }, 5000);
    }
    
  }

  return (
    <div className="registerWrapper" style={styles.resgisterWrapper}>
      <div className="container" style={styles.container}>
        <div className="inputs" style={styles.inputs}>
          <input
            style={styles.input}
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button onClick={registerNewUser}>Register</Button>

          <p
            className="warning"
            style={usernameExists ? styles.warning : styles.hide}
          >
            This username already exists
          </p>
        </div>
          <p
            className="warning"
            style={passwordMismatch ? styles.mismatch : styles.invisable}
          >
            Password mismatch
          </p>
        </div>
      </div>
    
  );
}

const styles = {
  resgisterWrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "grid",
    gridTemplateRows: "25% 50% 25%",
    fontSize: "2em",
  },
  inputs: {
    paddingTop: "5vh",
    display: "flex",
    flexDirection: "column",
    gap: "2vh",
    fontSize: "0.8em",
    width: "80%",
    alignItems: "center",
    marginLeft: "4vh",
    justifyContent: "center",
  },
  input: {
    borderRadius: "5px",
    border: "none",
    padding: "4px",
  },
  login: {
    fontSize: "23px",
    marginTop: "20px",
  },
  warning: {
    fontSize: "20px",
    color: "red",
    display: "block",
    paddingBottom: "5vh",
  },
  hide: {
    color: "#f1e7e0",
    fontSize: "20px",
  },
  success: {
    fontSize: "20px",
    color: "green",
    display: "block",
  },
  invisable: {
    display: "none",
  },
  mismatch: {
    position: "fixed",
    right: "35vw",
    bottom: "7vh",
    color: "white",
    fontSize: "15px",
    backgroundColor: "red",
    padding: "3px",
    borderRadius: "5px",
    opacity: "0.7",
  },
};
