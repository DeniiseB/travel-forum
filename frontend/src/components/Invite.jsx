import { Button, Modal, Form } from "react-bootstrap";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useGroupContext } from "../contexts/GroupContext";

function Invite(props) {
  const { getUserByUserName, addGroupIdToJoinedGroupIds } =
    useContext(UserContext);
  const { addUserIdToGroupMembers } = useGroupContext();
  const [userName, setUserName] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const [userAlreadyAdded, setUserAlreadyAdded] = useState(false);

  function handleClose() {
    props.showModal();
  }

  function updateGroupWithNewMembers() {
    props.updateGroup();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let fetchedUser = await getUserByUserName(userName);
    setUserNotFound(!fetchedUser);
    if (fetchedUser) {
      await addGroupToUser(fetchedUser);
      await addUserToGroup(fetchedUser);
    }
  }

  async function addGroupToUser(user) {
    let userJoinedGroupIds = user.joinedGroups.split(" ");
    if (!userJoinedGroupIds.includes(props.group.id.toString())) {
      userJoinedGroupIds.push(props.group.id.toString());
      let groupObject = {
        userId: user.id,
        groupIds: userJoinedGroupIds.join(" "),
      };
      await addGroupIdToJoinedGroupIds(groupObject);
    }
  }

  async function addUserToGroup(user) {
    let groupMemberIds = props.group.groupMembers.split(" ");
    if (!groupMemberIds.includes(user.id.toString())) {
      groupMemberIds.push(user.id.toString());
      let groupObject = {
        groupId: props.group.id,
        userIds: groupMemberIds.join(" "),
      };
      await addUserIdToGroupMembers(groupObject);
      userAddedMessage();
      updateGroupWithNewMembers();
    } else {
      userAlreadyAddedMessage();
    }
  }

  function userAddedMessage() {
    setUserAdded(true);
    setTimeout(() => {
      setUserAdded(false);
    }, 4000);
  }

  function userAlreadyAddedMessage() {
    setUserAlreadyAdded(true);
    setTimeout(() => {
      setUserAlreadyAdded(false);
    }, 4000);
  }

  return (
    <Modal onHide={handleClose} show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>Add members</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Enter username</Form.Label>
            <Form.Control
              placeholder="ex. robin420"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {userNotFound && (
              <Form.Text className="text-muted">
                Sorry, we can't find that user
              </Form.Text>
            )}
            {userAlreadyAdded && (
              <Form.Text className="text-muted">
                That user is already a member
              </Form.Text>
            )}
            {userAdded && (
              <Form.Text style={{ color: "green" }}>User added!</Form.Text>
            )}
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!userName}>
            Add
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Invite;
