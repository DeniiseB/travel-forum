import React from "react";
import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useGroupContext } from "../contexts/GroupContext";
import { UserContext } from "../contexts/UserContext";

function MyGroups() {
  const { getJoinedAndCreatedGroups } = useGroupContext();
  const { currentUser } = useContext(UserContext);
  const [allCreatedGroups, setAllCreatedGroups] = useState([]);
  const [allJoinedGroups, setAllJoinedGroups] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    fetchAndSetGroups();
  }, [currentUser]);

  const fetchAndSetGroups = async () => {
    let res = await getJoinedAndCreatedGroups(currentUser.id);
    setAllCreatedGroups(res[0]);
    setAllJoinedGroups(res[1]);
  };

  function redirect(e, groupId) {
    e.preventDefault();
    history.push("/group/" + groupId);
  }

  return (
    <div className="wrapper" style={styles.wrapper}>
      {currentUser && allCreatedGroups && (
        <div>
          <h5 className="name" style={styles.name}>
            Created groups
          </h5>

          <div className="createdGroups" style={styles.groups}>
            {allCreatedGroups.length > 0 ? (
              allCreatedGroups.map((group) => (
                <div
                  className="groupItem"
                  style={styles.groupItem}
                  key={group.id}
                  onClick={(e) => redirect(e, group.id)}
                >
                  <div>{group.category}</div>
                  <div>{group.groupName}</div>
                </div>
              ))
            ) : (
              <p>You don't have any created groups yet</p>
            )}
          </div>

          <h5 style={styles.nameJoined}>Joined groups</h5>
          <div className="joinedGroups" style={styles.groups}>
            {allJoinedGroups.length > 0 ? (
              allJoinedGroups.map((group) => (
                <div
                  className="groupItem"
                  style={styles.groupItem}
                  key={group.id}
                  onClick={(e) => redirect(e, group.id)}
                >
                  <div>{group.category}</div>
                  <div>{group.groupName}</div>
                </div>
              ))
            ) : (
              <p>You don't have any joined groups yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGroups;

const styles = {
  wrapper: {
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
  },
  groups: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "2vh",
    paddingRight: "2vh",
    paddingLeft: "2vh",
    overflowY: "scroll",
    height: "18vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-around",
  },
  name: {
    paddingTop: "5vh",
    paddingBottom: "1vh",
  },
  groupItem: {
    display: "flex",
    border: "1px solid black",
    borderRadius: "4px",
    justifyContent: "space-around",
    padding: "0.2rem",
  },
  hide: {
    display: "none",
  },
  nameJoined: {
    marginTop: "3vh",
  },
};
