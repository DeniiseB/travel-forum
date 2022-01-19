import { Dropdown, Button } from "react-bootstrap";

function Members(props) {
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
                <Button>
                  <i className="bi bi-x-octagon-fill" color="white"></i>
                </Button>
                {"  "}
                <Button>
                  <i className="bi bi-trash-fill" color="white"></i>
                </Button>
              </p>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Members;
