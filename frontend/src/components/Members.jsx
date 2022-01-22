import { useState, useContext, useEffect } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { useGroupContext } from "../contexts/GroupContext";

function Members(props) {
  const { fetchGroupById } = useGroupContext();
  const [isCreator, setIsCreator] = useState(false);
  const groupId = props.groupId;
  const { currentUser, deleteUser, blockUser, unblockUser } =
    useContext(UserContext);

  useEffect(() => {
    checkRole();
  }, []);

  async function checkRole() {
    const fetchedGroup = await fetchGroupById(groupId);
    if (currentUser.id == fetchedGroup.creatorUserId) {
      setIsCreator(true);
    } else {
      setIsCreator(false);
    }
  }

  async function deleteGroupMember(e, memberId) {
    e.stopPropagation();
    let res = await deleteUser(memberId);
    if (res.status === 200) {
      props.func(true);
    }
  }

  async function blockGroupMember(e, memberId) {
    e.stopPropagation();
    let res = await blockUser(memberId);
    if (res.status === 200) {
      props.func(true);
    }
  }

  async function unblockGroupMember(e, memberId) {
    e.stopPropagation();
    let res = await unblockUser(memberId);
    if (res.status === 200) {
      props.func(true);
    }
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
                <div style={styles.userName}>{member.username}</div>
                {currentUser && currentUser.role === "admin" ? (
                  <div style={styles.buttons}>
                    {member.blocked ? (
                      <div>
                        <Button
                          onClick={(e) => {
                            unblockGroupMember(e, member.id);
                          }}
                        >
                          <i class="bi bi-arrow-clockwise" color="white"></i>
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          onClick={(e) => {
                            blockGroupMember(e, member.id);
                          }}
                        >
                          <i className="bi bi-x-octagon-fill" color="white"></i>
                        </Button>
                      </div>
                    )}

                    {"  "}
                    <Button
                      onClick={(e) => {
                        deleteGroupMember(e, member.id);
                      }}
                    >
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
  userName: {
    fontWeight: "bold",
  },
  removeButton: {
    float: "left",
    marginRight: "5vh",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: "1vh",
  },
};
