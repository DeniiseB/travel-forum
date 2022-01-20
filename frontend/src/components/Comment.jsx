import { Container, Row, Col, Button } from "react-bootstrap";
import { useGroupContext } from "../contexts/GroupContext";
import { UserContext } from "../contexts/UserContext";
import { useEffect, useState, useContext } from "react";

function Comment(props) {
  const { fetchGroupById, fetchCommentById, removeCommentById } = useGroupContext();
  const { currentUser } = useContext(UserContext);
  const [group, setGroup] = useState();
  const [isCreator, setIsCreator] = useState(false);
  const groupId = props.groupId
  useEffect(() => {
    checkRole()

  }, []);

  async function checkRole() {
    const fetchedGroup = await fetchGroupById(groupId);
    if (currentUser.id == fetchedGroup.creatorUserId) {
      setIsCreator(true);
    }
    else {
      setIsCreator(false);
    }
    console.log(groupId, "This is inside comment and groupid")
    console.log(fetchedGroup, "This is inside comment")
  }
  function formatting() {
    return props.commentObject.date
  }
  async function removeComment() {
    //remove comment
    let id = props.commentObject.id;

    await removeCommentById(id);
    console.log(id, "commentId in remove comment")
  }

  return (
    <Container style={styles.commentContainer}>
      {(currentUser && currentUser.role) === "admin" ? (
        <div>
          <p style={styles.delete}>X</p>
        </div>
      ) : null}

      <div style={styles.commentHeader}>
        <p style={{ marginBottom: "0" }}> By {props.commentObject.author}</p>
        <p>{props.commentObject.date}</p>
      </div>
      <Row>
        <Col>
          <p dangerouslySetInnerHTML={{ __html: props.commentObject.content }}>
            { }
          </p>
        </Col>
      </Row>
      {isCreator &&
        <Row>
          <Col>
            <Button onClick={removeComment}>X</Button>
          </Col>
        </Row>
      }
    </Container>
  );
}

export default Comment;

const styles = {
  commentContainer: {
    width: "15rem",
    border: "solid lightGrey 1px",
    borderRadius: "4px",
    marginBottom: "0.5rem"
  },
  commentHeader: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    fontSize: "small"
  },
  delete: {
    position: "absolute",
    right: "8vh"
  }
};
