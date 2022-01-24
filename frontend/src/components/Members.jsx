import { useContext } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { useGroupContext } from "../contexts/GroupContext";
function Members(props) {
  const { currentUser, deleteUser, blockUser, unblockUser } =
    useContext(UserContext);
  const { addUserIdToGroupMembers, fetchCommentByUserId, deleteSpecificComment } = useGroupContext();
  async function deleteGroupMember(e, memberId) {
    e.stopPropagation();
    let res = await deleteUser(memberId);
    if (res.status === 200) {
      props.func();
    }
  }
  async function getAndRemoveGroupMember(clickedId) {
    const groupMembersIds = props.group.groupMembers.split(" ");
    let finalString = '';
    for (let id of groupMembersIds) {
      if (clickedId == id) {

      } else {
        finalString += id + ' ';
      }
    }
    let groupObject = {
      groupId: props.group.id,
      userIds: finalString,
    };
    let fetched = [];
    let commentIDS = await fetchCommentByUserId(clickedId)
    console.log(commentIDS.id)
    deleteSpecificComment(commentIDS.id)
  //  await addUserIdToGroupMembers(groupObject)
  }
  async function blockGroupMember(e, memberId) {
    e.stopPropagation();
    let res = await blockUser(memberId);
    if (res.status === 200) {
      props.func();
    }
  }

  async function unblockGroupMember(e, memberId) {
    e.stopPropagation();
    let res = await unblockUser(memberId);
    if (res.status === 200) {
      props.func();
    }
  }

  return (
    <div style={styles.membersContainer}>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Members
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {props.groupMembers.map((member) => (
            <Dropdown.Item key={member.id}>
              <div style={styles.memberContainer}>
                <div style={styles.userName}>{member.username}</div>
                {currentUser && currentUser.role === "admin" ? (
                  <div style={styles.buttons}>
                    {member.blocked ? (
                      <div>
                        <Button
                          className="m-1"
                          size="sm"
                          onClick={(e) => {
                            unblockGroupMember(e, member.id);
                          }}
                        >
                          Unblock
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={(e) => {
                            blockGroupMember(e, member.id);
                          }}
                        >
                          Block
                        </Button>
                      </div>
                    )}

                    {"  "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        deleteGroupMember(e, member.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ) : null}
                {props.isCreator ? (
                  <div>
                    <div>
                      <Button onClick={() => { getAndRemoveGroupMember(member.id) }} className="m-1" size="sm" variant="danger">
                        Remove
                      </Button>
                    </div>
                    {"  "}
                    <div>
                      <Button className="m-1" size="sm">
                        Make Moderator
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
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
    width: "20rem",
  },
  memberContainer: {
    display: "flex",
    alignItems: "center",
    border: "solid 1px lightgrey",
    borderRadius: "4px",
    padding: "0.2rem",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
  },
  userName: {
    fontWeight: "500",
    margin: "0.2rem",
  },
};
