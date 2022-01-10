import React from "react";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useHistory } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [badCredentials, setBadCredentials] = useState(false);
  const [tooManyAttempts, setTooManyAttempts]=useState(false)
  const { login } = useContext(UserContext);
  const history = useHistory();

  async function loginUser() {
    let credentials = {
      username: username,
      password: password,
    };
    let res = await login(credentials);
    setTimeout(function () {
      if (res.status) {


      if (res.status === 200) {
        history.push("/");
      }
      else if (res.status === 403)
      {
        setTooManyAttempts(true);
        console.log("Too many password attempts");
        setTimeout(function () {
          setTooManyAttempts(false);
        }, 3000);
      }
      else
      {
        setBadCredentials(true);
        setTimeout(function () {
          setBadCredentials(false);
        }, 3000);
        }
        setUsername("");
        setPassword("");
      }
      else {
        setTooManyAttempts(true)
      }
     }, 5);
/*     if (res.status === 200) {
      history.push("/");
    } 
    else if (res.status === 403) {
      setTooManyAttempts(true)
      console.log("Too many password attempts")
       setTimeout(function () {
         setTooManyAttempts(false);
       }, 8000);
    }
    
    
    else {
      setBadCredentials(true);
      setTimeout(function () {
        setBadCredentials(false);
      }, 8000);
    }
    setUsername("");
    setPassword(""); */
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

          <button onClick={loginUser} style={styles.button} disabled={tooManyAttempts}>
            Log in
          </button>

          <p
            className="warning"
            style={badCredentials ? styles.warning : styles.hide}
          >
            Bad credentials
          </p>

          <p className="warning" style={tooManyAttempts ? styles.attempts : styles.unvisable}>Too many attempts, please try again later</p>
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
    gridTemplateRows: "60% 40%",
    fontSize: "2em",
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
  input: {
    height: "10%",
    padding: "1vh",
  },
  button: {
    fontSize: "20px",
    width: "38%",
  },
  register: {
    fontSize: "28px",
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
  unvisable: {
    display: "none",
  },
  attempts: {
    position: "fixed",
    right: "20px",
    bottom: "100px",
    color: "white",
    fontSize: "20px",
    backgroundColor: "red",
    padding: "3px",
    borderRadius: "5px",
    opacity:"0.7"
  },
};
