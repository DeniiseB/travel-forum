import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useState, useContext } from "react";
import { useGroupContext } from "../contexts/GroupContext";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function CreateGroup() {
  const { postNewGroup, postNewComment } = useGroupContext();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Other");
  const [access, setAccess] = useState("Public");
  const [comment, setComment] = useState("");
  const [warning, setWarning] = useState(false);
  const history = useHistory();
  const { currentUser } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();

    let commentId = await postComment();

    if (commentId.error) {
      console.log(commentId.error);
      setWarning(true);
      return;
    } else {
      commentId = commentId.id.toString();
      setWarning(false);
    }

    // Adding first commentId as string. New comment ids will be added to this string.
    const newGroup = {
      creatorUserId: currentUser.id, 
      groupName: title,
      groupAccess: access,
      commentIds: commentId,
    };

    let response = await postNewGroup(newGroup);

    if (response.error) {
      console.log(response.error);
      setWarning(true);
      return;
    } else {
      setTitle("");
      setCategory("Sweden");
      setAccess("Public");
      setComment("");
      setWarning(false);

      // history.push("/")
    }
  }

  async function postComment() {
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const firstComment = {
      userId: 8,
      date: date,
      content: comment,
    };

    let res = await postNewComment(firstComment);
    return res;
  }

  return (
    <div className="m-2">
      <div>
        <h2 className="mt-5">Create New Group</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mt-3" controlId="formGridAddress1">
            <Form.Label>Group Title</Form.Label>
            <Form.Control
              placeholder="ex. Travelbuddy to Finland"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Row className="mt-2">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Other</option>
                <option>Sweden</option>
                <option>Finland</option>
                <option>United Kingdom</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Form.Group className="mt-2">
            <Form.Label>Group access</Form.Label>
            <Container
              style={styles.accessContainer}
              onChange={(e) => setAccess(e.target.value)}
            >
              <Form.Check
                defaultChecked
                type="radio"
                name="access"
                label="Public"
                value="Public"
              />
              <Form.Check
                type="radio"
                name="access"
                label="Private"
                value="Private"
              />
            </Container>
          </Form.Group>

          <Form.Group className="mt-2" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              as="textarea"
              rows={3}
              maxLength="1000"
            />
          </Form.Group>

          <Button
            className="mt-3"
            variant="primary"
            type="submit"
            disabled={!title || !comment}
          >
            Create Group
          </Button>
          <div>
            {(!title || !comment || warning) && (
              <p>Please fill out all fields</p>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CreateGroup;

const styles = {
  accessContainer: {
    width: "8rem",
    border: "solid lightGrey 1px",
    borderRadius: "4px",
  },
};
