import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useGroupContext } from "../contexts/GroupContext";
import Comment from "../components/Comment";
import Invite from "../components/Invite";
import { useEffect, useState } from "react";

function Group() {
  const { groupid } = useParams();
  const { fetchGroupById, fetchCommentById } = useGroupContext();
  const [group, setGroup] = useState({});
  const [comments, setComments] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    getAndSetGroup();
  }, [groupid]);

  async function getAndSetGroup() {
    const fetchedGroup = await fetchGroupById(groupid);
    setGroup(fetchedGroup);
    getAndSetComments(fetchedGroup);
  }

  async function getAndSetComments(group) {
    const commentIdArray = group.commentIds.split(" ");
    let commentArray = [];
    for (let commentId of commentIdArray) {
      let comment = await fetchCommentById(parseInt(commentId));
      commentArray.push(comment);
    }
    setComments(commentArray);
  }

  const toggleInviteModal = () => { 
    let boolean = showInviteModal ? false : true;
    setShowInviteModal(boolean)
  }

  return (
    <div>
      {group && comments && (
        <div className="m-2">
          <Container>
            <Row>
              <Col>
                <h2>{group.groupName}</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button onClick={toggleInviteModal}>Invite</Button>
              </Col>
              <Col>
                <Button>Members</Button>
              </Col>
              <Col>
                <Button>Comment</Button>
              </Col>
            </Row>
          </Container>
          <Container className="mt-2">
            {comments.map((commentObject) => (
              <Comment key={commentObject.id} commentObject={commentObject} />
            ))}
          </Container>
        </div>
      )}
      {!group && (
        <div style={styles.spinnerDiv}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <Invite showModal={toggleInviteModal} show={showInviteModal}/>
    </div>
  );
}

export default Group;

const styles = {
  spinnerDiv: {
    marginTop: "10rem",
  },
};
