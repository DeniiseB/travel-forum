import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useState } from "react";
import { useGroupContext } from "../contexts/GroupContext";

function CreateGroup() {
  const { postNewGroup, postNewComment } = useGroupContext();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sweden");
  const [access, setAccess] = useState("Public");
  const [comment, setComment] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await postComment();

    // Add current user id
    // Add comment id

    // const newGroup = {
    //   creatorUserId: 8,
    //   groupName: title,
    //   groupAccess: access,
    // };

    // let response = await postNewGroup(newGroup);
    // console.log(response);

    // Go to group page

    setTitle("");
    setCategory("Sweden");
    setAccess("Public");
    setComment("");
  }

  async function postComment() {
    // Converts JS date to SQLite datetime
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const firstComment = {
      userId: 8,
      // date: date,
      content: comment,
    };

    let res = await postNewComment(firstComment)

    console.log(res)
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

          <Button className="mt-3" variant="primary" type="submit">
            Create Group
          </Button>
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
