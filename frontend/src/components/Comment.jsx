import { Container, Row, Col } from "react-bootstrap";
import { useGroupContext } from "../contexts/GroupContext";
import { UserContext } from "../contexts/UserContext";
import { useEffect, useState, useContext } from "react";

function Comment(props) {
  const { fetchGroupById, deleteSpecificComment } = useGroupContext();
  const { currentUser } = useContext(UserContext);
  const [isCreator, setIsCreator] = useState();

  const groupId = props.groupId;

  useEffect(() => {
    checkRole();
  }, []);

  async function checkRole() {
    const fetchedGroup = await fetchGroupById(groupId);
    if (currentUser.id == fetchedGroup.creatorUserId) {
      setIsCreator(true);
    } else {
      setIsCreator(false);
    }
  }

  async function deleteThisComment(commentId) {
    let res = await deleteSpecificComment(commentId);
    if (res.status === 200) {
      props.func(true);
    }
  }

  return (
    <Container style={styles.commentContainer}>
      {(currentUser && currentUser.role) === "admin" || isCreator ? (
        <div>
          <p
            style={styles.delete}
            onClick={(e) => deleteThisComment(props.commentObject.id)}
          >
            X
          </p>
        </div>
      ) : null}

      <div style={styles.commentHeader}>
        <p style={{ marginBottom: "0" }}> By {props.commentObject.author}</p>
        <p>{props.commentObject.date}</p>
      </div>
      <Row>
        <Col>
          <p dangerouslySetInnerHTML={{ __html: props.commentObject.content }}>
            {}
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Comment;

const styles = {
  commentContainer: {
    border: "solid lightGrey 1px",
    borderRadius: "4px",
    marginBottom: "0.5rem",
    backgroundColor: "#ffffffa8",
  },
  commentHeader: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    fontSize: "small",
  },
  delete: {
    position: "absolute",
    right: "8vh",
  },
};
