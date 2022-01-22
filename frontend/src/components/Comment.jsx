import { Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

function Comment(props) {
  const { currentUser } = useContext(UserContext);

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
    width: "20rem",
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
