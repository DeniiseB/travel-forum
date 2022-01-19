import { useContext } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";

function Members(props) {
  const { currentUser } = useContext(UserContext);

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
              </p>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Members;
