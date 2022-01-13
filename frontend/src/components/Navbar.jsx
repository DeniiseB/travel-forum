import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import { useState, useContext } from "react";
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
              Logout
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
    backgroundColor: "#C4C4C4",
    padding: "5vw 2vw 5vw 3vw",
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
  loginButton: {
    
  },

  ul: {
    fontSize: "1.2em",
    paddingLeft: "5vw",
  },
  mainName: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "1.0em",
    color: "black",
  },

  hide: {
    display: "none",
  },
  href: {
    color: "white",
    textDecoration:"none"
  }
};