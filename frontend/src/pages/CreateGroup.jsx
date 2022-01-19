import { Form, Row, Col, Button, Container } from "react-bootstrap";
import ReactQuill from "react-quill"; // ES6
import "react-quill/dist/quill.snow.css"; // ES6
import { useState, useContext } from "react";
import { useGroupContext } from "../contexts/GroupContext";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { CategoryContext } from "../contexts/CategoryContext";

function CreateGroup() {
  const history = useHistory();
  const { postNewGroup, postNewComment } = useGroupContext();
  const { currentUser, addGroupToJoinedGroupsAndCreatedGroups } =
    useContext(UserContext);
  const { categories, postToGroupsXCategories } = useContext(CategoryContext);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(1);
  const [access, setAccess] = useState("Public");
  const [comment, setComment] = useState("");
  const [warning, setWarning] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    let commentObject = await postComment();

    if (commentObject.error) {
      console.log(commentObject.error);
      setWarning(true);
      return;
    } else {
      setWarning(false);
    }

    let commentObjectId = commentObject.id.toString();
    let newGroupObject = await postGroup(commentObjectId);

    if (newGroupObject.error) {
      console.log(newGroupObject.error);
      setWarning(true);
      return;
    } else {
      setWarning(false);
    }

    let newGroupObjectId = newGroupObject.id.toString();
    await postGroupsXCategories(newGroupObjectId);

    await addGroupToUser(newGroupObjectId);

    setTitle("");
    setCategory("Afganistan");
    setAccess("Public");
    setComment("");
    history.push("/group/" + newGroupObjectId);
  }

  async function postComment() {
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const firstComment = {
      userId: currentUser.id,
      date: date,
      content: comment,
      author: currentUser.username,
    };
    let res = await postNewComment(firstComment);
    return res;
  }

  async function postGroup(commentId) {
    const newGroup = {
      creatorUserId: currentUser.id,
      groupName: title,
      groupAccess: access,
      commentIds: commentId,
      groupMembers: currentUser.id.toString(),
      groupModerators: "",
    };
    let res = await postNewGroup(newGroup);
    return res;
  }

  async function postGroupsXCategories(newGroupId) {
    let newRow = {
      groupId: newGroupId,
      categoryId: category,
    };
    let res = await postToGroupsXCategories(newRow);
    return res;
  }

  async function addGroupToUser(groupId) {
    let userCreatedGroupIds = currentUser.createdGroups.length
      ? currentUser.createdGroups.split(" ")
      : [];
    let userJoinedGroupIds = currentUser.joinedGroups.length
      ? currentUser.joinedGroups.split(" ")
      : [];

    userCreatedGroupIds.push(groupId);
    userJoinedGroupIds.push(groupId);

    let groupObject = {
      userId: currentUser.id,
      createdGroupIds: userCreatedGroupIds.join(" "),
      joinedGroupIds: userCreatedGroupIds.join(" "),
    };

    await addGroupToJoinedGroupsAndCreatedGroups(groupObject);
  }

  const handleChange = (value) => {
    setComment(value);
  };

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
              <Form.Select onChange={(e) => setCategory(e.target.value)}>
                {categories &&
                  categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
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
            <ReactQuill value={comment || ""} onChange={handleChange} />
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
