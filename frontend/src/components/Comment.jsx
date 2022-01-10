import { Container, Row, Col} from "react-bootstrap";

function Comment(props) {
  return (
    <Container style={styles.commentContainer}>
      <div style={styles.commentHeader}>
        <p style={{ marginBottom: "0" }}> By #userName</p>
        <p>{props.commentObject.date}</p>
      </div>
      <Row>
        <Col>
          <p>{props.commentObject.content}</p>
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
    marginBottom: "0.5rem"
  },
  commentHeader: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    fontSize: "small"
  }
};
