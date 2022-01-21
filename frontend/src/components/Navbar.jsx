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
          <div style={styles.loginButton}>
            <Button color="dark" size="sm">
              <a href="/login" style={styles.href}>
                Login
              </a>
            </Button>
          </div>
          <div style={styles.registerButton}>
            <Button color="dark" size="sm">
              <a href="/register" style={styles.href}>
                Register
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div style={styles.logoutButton}>
            <Button color="dark" size="sm" onClick={logout}>
              <a href="/" style={styles.href}>
                Logout
              </a>
            </Button>
          </div>
          <div>
            <h3>{currentUser.username}</h3>
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
  },
  loginButtons: {
    fontFamily: "Montserrat, sans-serif",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    right: "0",
  },
  registerButton: {
    marginLeft: "10px",
    marginRight: "5vw",
  },
  loginButton: {},

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
  href: {
    color: "white",
    textDecoration: "none",
  },
};
