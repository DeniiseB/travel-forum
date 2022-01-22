import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "reactstrap";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

function Navbar() {
  const { currentUser, logout } = useContext(UserContext);

  return (
    <nav className="navbar navbar-dark" style={styles.navbar}>
      <a href="/" style={styles.mainName} className="link">
        Travel Forum
      </a>
      {currentUser === null ? (
        <div style={styles.loginButtons}>
          <div>
            <Button style={styles.loginButton}>
              <a href="/login" style={{ color: "white" }}>
                Login
              </a>
            </Button>
          </div>
          <div>
            <Button style={styles.registerButton}>
              <a href="/register" style={{ color: "white" }}>
                Register
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div style={styles.loggedIn}>
            <div>
              <p>{currentUser.username}</p>
            </div>
            <div>
              <Button onClick={logout} style={styles.logoutButton}>
                <a href="/" style={{ color: "white" }}>
                  Logout
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

const styles = {
  navbar: {
    backgroundColor: "#424242",
    padding: "5vw 2vw 5vw 3vw",
    position: "fixed",
    width: "100%",
    height: "5rem",
    top: "0",
    zIndex: "100",
  },
  loginButtons: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    right: "0",
  },
  loginButton: {
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "600",
    fontSize: "1em",
    backgroundColor: "#d99e74",
  },
  registerButton: {
    marginLeft: "10px",
    marginRight: "5vw",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "600",
    fontSize: "1em",
    backgroundColor: "#d99e74",
  },
  logoutButton: {
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "600",
    fontSize: "1em",
    marginLeft: "0.2rem",
    backgroundColor: "#d99e74",
  },
  loggedIn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "600",
    fontSize: "1em",
    color: "white",
  },
  ul: {
    fontSize: "1.2em",
    paddingLeft: "5vw",
  },
  mainName: {
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: "1.3em",
    color: "white",
    textDecoration: "none",
  },

  hide: {
    display: "none",
  },
};
