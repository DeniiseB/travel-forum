import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useGroupContext } from "../contexts/GroupContext";
import { UserContext } from "../contexts/UserContext";
import Comment from "../components/Comment";
import Invite from "../components/Invite";
import Members from "../components/Members";
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

function Group() {
  const history = useHistory();
  const { groupid } = useParams();
  const { fetchGroupById, fetchCommentById } = useGroupContext();
  const { getUserById } = useContext(UserContext);
  const [group, setGroup] = useState({});
  const [comments, setComments] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    getAndSetGroup();
  }, [groupid]);

  async function getAndSetGroup() {
    const fetchedGroup = await fetchGroupById(groupid);
    setGroup(fetchedGroup);
    await getAndSetComments(fetchedGroup);
    await getAndSetGroupMembers(fetchedGroup);
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

  async function getAndSetGroupMembers(group) {
    const groupMemberIds = group.groupMembers.split(" ");
    const groupMemberArray = []

    for (let id of groupMemberIds) { 
      let fetchedUser = await getUserById(id)
      groupMemberArray.push(fetchedUser)
    }
    setGroupMembers(groupMemberArray);
  }

  const toggleInviteModal = () => {
    let boolean = showInviteModal ? false : true;
    setShowInviteModal(boolean);
  };

  const updateGroup = async () => {
    await getAndSetGroup();
  };

  function redirectToCommentPage() {
    history.push("/create-comment/" + groupid);
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
                <Members groupMembers={groupMembers} />
              </Col>
              <Col>
                <Button onClick={redirectToCommentPage}>Comment</Button>
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
      <Invite
        showModal={toggleInviteModal}
        show={showInviteModal}
        group={group}
        updateGroup={updateGroup}
      />
    </div>
  );
}

export default Group;

const styles = {
  spinnerDiv: {
    marginTop: "10rem",
  },
};
