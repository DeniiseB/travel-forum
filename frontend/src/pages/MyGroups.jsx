
import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useGroupContext } from "../contexts/GroupContext";
import { UserContext } from "../contexts/UserContext";



function MyGroups() {

  const { getCreatedGroups } = useGroupContext();
  const { currentUser, getCurrentUser } = useContext(UserContext);
  const [allCreatedGroups, setAllCreatedGroups]=useState([])

  useEffect(async () => {

     let user = await getCurrentUser();
    let res = await getCreatedGroups(user.id);
    await setAllCreatedGroups(res);
    
  }, []);

 

  return (
    <div className="wrapper">
      <h5 className="name" style={styles.name}>Created groups</h5>
      <div className="header" style={styles.header}>
        <p>Topics</p>
      <p>Group name</p>
      </div>
      
      <div className="createdGroups" style={styles.createdGroups}>
        {allCreatedGroups.length > 0 && currentUser.id ? (
          allCreatedGroups.map((group) => (
            <div className="groupItem" style={styles.groupItem}>
              <p>#Category</p>
              <p>{group.groupName}</p>
            </div>
          ))
        ) : (
          <p>You don't have any created groups yet</p>
        )}
      </div>

      <div className="joinedGroups">
        <h5 style={styles.name}>Joined groups</h5>
      </div>
    </div>
  );
}

export default MyGroups;

const styles = {
  createdGroups: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "2vh",
    paddingRight: "2vh",
    paddingLeft:"2vh",
    overflowY: "scroll",
    height:"25vh"
  },
  header: {
    display: "flex",
    justifyContent: "center",
    gap: "20vw",
    paddingTop:"3vh"
    
  },
  name: {
    marginTop:"5vh"
  },
  groupItem: {
    display: "flex",
    border: "1px solid black",
    justifyContent:"center",
    gap:"10vh"
    
  }
  
}