import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import { createContext, useState, useEffect } from "react";

function Navbar() {

  const [loggedIn, setLoggedIn] = useState(false);
  
  function loginSet (){
    setLoggedIn(true)
  }
  return (

    <nav class="navbar navbar-dark" style={styles.navbar}>
        <a href="/" style={styles.mainName} className="link">
          Travel Forum
        </a>
        {!loggedIn ? (
          <div style={styles.loginButtons}>
        <div style={styles.loginButton}>
          <Button color="dark" size="sm" onClick={loginSet}>Login</Button>
            </div>
            <div style={styles.registerButton}>
          <Button color="dark" size="sm" onClick={loginSet}>Register</Button>
            </div>
          </div>
        ) : (
         <div>
          <div style={styles.logoutButton}>
            <Button color="dark" size="sm" >Logout</Button>
          </div>
          <div>
            <h3>#Username</h3>
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
};