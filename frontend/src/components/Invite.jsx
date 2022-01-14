import { Button, Modal, Form } from "react-bootstrap";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

function Invite(props) {
  const { getUserByUserName, addGroupIdToJoinedGroupIds } =
    useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);

  function handleClose() {
    props.showModal();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let fetchedUser = await getUserByUserName(userName);
    setUserNotFound(!fetchedUser);
    if (fetchedUser) {
      await addGroupToUser(fetchedUser);
    }
    // ADD user to group!!!!!!
  }

  async function addGroupToUser(user) {
    let userJoinedGroupIds = user.joinedGroups.split(" ");
    if (!userJoinedGroupIds.includes(props.group.id.toString())) {
      userJoinedGroupIds.push(props.group.id.toString());
      let groupObject = {
        userId: user.id,
        groupIds: userJoinedGroupIds.join(" "),
      };
      let response = await addGroupIdToJoinedGroupIds(groupObject);
      console.log(response.data);
    }
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
