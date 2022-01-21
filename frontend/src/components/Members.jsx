import { useContext } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";

function Members(props) {
  const { currentUser, deleteUser, blockUser, unblockUser } =
    useContext(UserContext);

  async function deleteGroupMember(e, memberId) {
    e.stopPropagation()
    let res = await deleteUser(memberId)
    if (res.status === 200) {
      props.func(true)
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
        <Dropdown.Menu>
          {props.groupMembers.map((member) => (
            <Dropdown.Item key={member.id}>
              <p>
                {member.username} {"  "}
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
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap:"1vh"
  }
}
