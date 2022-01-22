import React from "react";
import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useGroupContext } from "../contexts/GroupContext";
import { UserContext } from "../contexts/UserContext";

function MyGroups() {
  const { getJoinedAndCreatedGroups } = useGroupContext();
  const { currentUser, getCurrentUser } = useContext(UserContext);
  const [allCreatedGroups, setAllCreatedGroups] = useState([]);
  const [allJoinedGroups, setAllJoinedGroups] = useState([]);
  const history = useHistory();
  useEffect(async () => {
    let user = await getCurrentUser();
    
    let res = await getJoinedAndCreatedGroups(user.id);
   
      setAllCreatedGroups(res[0]);
    setAllJoinedGroups(res[1]);
    
    
  }, []);

  function redirect(e, groupId) {
    e.preventDefault();
    history.push("/group/" + groupId);
  }

  return (
    <div className="wrapper" style={styles.wrapper}>
      <h5 className="name" style={styles.name}>
        Created groups
      </h5>
      <div
        className="header"
        style={
          allCreatedGroups && allCreatedGroups.length > 0
            ? styles.header
            : styles.hide
        }
      >
        <p>Topics</p>
        <p>Group name</p>
      </div>

      <div className="createdGroups" style={styles.createdGroups}>
        {allCreatedGroups &&
        allCreatedGroups.length > 0 &&
        currentUser.id ? (
          allCreatedGroups.map((group) => (
            <div
              className="groupItem"
              style={styles.groupItem}
              key={group.id}
              onClick={(e) => redirect(e, group.id)}
            >
              <p>{group.category}</p>
              <p>{group.groupName}</p>
            </div>
          ))
        ) : (
          <p>You don't have any created groups yet</p>
        )}
      </div>

      <h5 style={styles.nameJoined}>Joined groups</h5>
      <div className="joinedGroups" style={styles.joinedGroups}>
        {allJoinedGroups !== undefined &&
        allJoinedGroups.length > 0 &&
        currentUser.id ? (
          allJoinedGroups.map((group) => (
            <div
              className="groupItem"
              style={styles.groupItem}
              key={group.id}
              onClick={(e) => redirect(e, group.id)}
            >
              <p>{group.category}</p>
              <p>{group.groupName}</p>
            </div>
          ))
        ) : (
          <p>You don't have any joined groups yet</p>
        )}
      </div>
    </div>
  );
}

export default MyGroups;

const styles = {
  wrapper: {
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
  },
  createdGroups: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "2vh",
    paddingRight: "2vh",
    paddingLeft: "2vh",
    overflowY: "scroll",
    height: "25vh",
  },
  joinedGroups: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "2vh",
    paddingRight: "2vh",
    paddingLeft: "2vh",
    overflowY: "scroll",
    height: "25vh",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    gap: "20vw",
    paddingTop: "3vh",
  },
  name: {
    paddingTop: "5vh",
    paddingBottom: "1vh",
  },
  groupItem: {
    display: "flex",
    border: "1px solid black",
    justifyContent: "center",
    gap: "10vh",
    alignItems: "center",
    paddingTop: "1vh",
  },
  hide: {
    display: "none",
  },
  nameJoined: {
    marginTop: "8vh",
    paddingBottom: "3vh",
  },
};
