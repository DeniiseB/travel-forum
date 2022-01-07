import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';

function Navbar() {
  return (
    
    <nav class="navbar navbar-dark" style={styles.navbar}>
        <a href="/" style={styles.mainName} className="link">
          Travel Forum
        </a>
       
          <div style={styles.loginButtons}>
        <div style={styles.loginButton}>
          <Button color="dark" size="sm">Login</Button>
            </div>
            <div style={styles.registerButton}>
          <Button color="dark" size="sm">Register</Button>
            </div>
          </div>
        
     

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
  },
  loginButton: {
    
  },

  ul: {
    fontSize: "1.2em",
    paddingLeft: "8vw",
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