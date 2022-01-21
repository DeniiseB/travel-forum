import { useState, useContext, useEffect } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { useGroupContext } from "../contexts/GroupContext";

function Members(props) {
  const { fetchGroupById } = useGroupContext();
  const { currentUser } = useContext(UserContext);
  const [isCreator, setIsCreator] = useState(false);
  const groupId = props.groupId

  useEffect(() => {
    checkRole()

  }, []);

  async function checkRole() {
    const fetchedGroup = await fetchGroupById(groupId);
    if (currentUser.id == fetchedGroup.creatorUserId) {
      setIsCreator(true);
    }
    else {
      setIsCreator(false);
    }
    console.log(groupId, "This is inside comment and groupid")
    console.log(fetchedGroup, "This is inside comment")
  }

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Members
        </Dropdown.Toggle>
        <Dropdown.Menu style={styles.dropDown}>
          {props.groupMembers.map((member) => (
            <Dropdown.Item key={member.id}>
              <p>
                <div style={styles.userName}>
                Username:{"  "}{member.username} {"  "}
                </div>
                {currentUser && currentUser.role === "admin" ? (
                  <div>
                    <Button>
                      <i className="bi bi-x-octagon-fill" color="white"></i>
                    </Button>
                    {"  "}
                    <Button>
                      <i className="bi bi-trash-fill" color="white"></i>
                    </Button>
                  </div>
                ) : null}
                 {isCreator ? (
                  <div>
                    <div style={styles.removeButton}>
                    <Button>
                      <i className="bi bi-x-octagon-fill" color="white"></i>
                    </Button>
                    <p>Remove</p>
                    </div>
                    {"  "}
                    <div>
                    <Button>
                      <i className="bi bi-plus-circle" color="white"></i>
                    </Button>
                    <p>Make Moderator</p>
                    </div>
                    <div>-------------------------------</div>
                  </div>
                ) : null}
              </p>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Members;

const styles = {
  dropDown: {
    width: "50vh",
  },
  userName:{
    fontWeight: "bold",
  },
  removeButton:{
    float: "left",
    marginRight: "5vh"
  }
};
