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
  const { fetchGroupById, fetchCommentById, deleteSpecificGroup } =
    useGroupContext();
  const { getUserById, currentUser } = useContext(UserContext);
  const [group, setGroup] = useState({});
  const [comments, setComments] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    getAndSetGroup();
  }, [groupid]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    checkGroupCreator();
  }, [currentUser]);

  async function getAndSetGroup() {
    const fetchedGroup = await fetchGroupById(groupid);
    setGroup(fetchedGroup);
    await getAndSetComments(fetchedGroup);
    await getAndSetGroupMembers(fetchedGroup);
    checkGroupCreator();
  }

  async function checkGroupCreator() {
    if (currentUser.id == group.creatorUserId) {
      setIsCreator(true);
    } else {
      setIsCreator(false);
    }
  }

  async function deleteThisGroup() {
    let res = await deleteSpecificGroup(groupid);
    if (res.status === 200) {
      history.push("/");
    }
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
    const groupMemberArray = [];

    for (let id of groupMemberIds) {
      let fetchedUser = await getUserById(id);
      groupMemberArray.push(fetchedUser);
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

  const pull_data = async (bool) => {
    if (bool) {
      await getAndSetGroup();
    }
  };

  return (
    <div>
      <div style={styles.groupContainer}>
        {group && comments && (
          <div className="m-2">
            <Container>
              {currentUser && currentUser.role === "admin" ? (
                <div style={styles.delete}>
                  <Row>
                    <Col>
                      <Button
                        onClick={(e) => {
                          deleteThisGroup();
                        }}
                      >
                        Delete group
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : null}

              <Row>
                <Col>
                  <div style={styles.title}>
                    <p>{group.groupName}</p>
                  </div>
                </Col>
              </Row>

              <Row>
                {isCreator && group.groupAccess == "Private" && (
                  <Col>
                    <Button onClick={toggleInviteModal}>Invite</Button>
                  </Col>
                )}
                <Col>
                  <Members
                    groupMembers={groupMembers}
                    func={pull_data}
                    groupId={groupid}
                    isCreator={isCreator}
                  />
                </Col>
                <Col>
                  <Button onClick={redirectToCommentPage}>Comment</Button>
                </Col>
              </Row>
            </Container>
            <Container className="mt-2">
              {comments.map((commentObject) => (
                <Comment
                  key={commentObject.id}
                  commentObject={commentObject}
                  func={pull_data}
                  groupId={groupid}
                />
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
    </div>
  );
}

export default Group;

const styles = {
  groupContainer: {
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    color: "#424242",
    paddingBottom: "8rem",
  },
  title: {
    fontWeight: "600",
    fontSize: "1.4em",
    textDecoration: "underline",
    marginTop: "1rem",
  },
  spinnerDiv: {
    marginTop: "10rem",
  },
  delete: {
    marginTop: "5vh",
    paddingBottom: "4vh",
  },
  commentContainer: {
    float: "left",
  },
};
