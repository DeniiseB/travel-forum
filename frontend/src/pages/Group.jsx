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
  const [isPrivateMember, setIsPrivateMember] = useState(false);

  useEffect(() => {
    getAndSetGroup();
  }, [groupid, currentUser]);

  useEffect(() => {
    privateMemberCheck();
  });

  async function getAndSetGroup() {
    const fetchedGroup = await fetchGroupById(groupid);
    setGroup(fetchedGroup);
    await getAndSetComments(fetchedGroup);
    await getAndSetGroupMembers(fetchedGroup);
    if (!currentUser) {
      return;
    }
    checkGroupCreator(fetchedGroup);
  }

  async function checkGroupCreator(fetchedGroup) {
    if (currentUser.id == fetchedGroup.creatorUserId) {
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

  function privateMemberCheck() {
    if (group.groupAccess === "Public") {
      setIsPrivateMember(true);
    } else if (group.groupAccess === "Private") {
      if (!currentUser) {
        setIsPrivateMember(false);
        return;
      }
      for (var i = 0; i < groupMembers.length; i++) {
        if (groupMembers[i].id == currentUser.id) {
          setIsPrivateMember(true);
        }
      }
    } else {
      setIsPrivateMember(false);
    }
  }

  function redirectToCommentPage() {
    history.push("/create-comment/" + groupid);
  }

  return (
    <div>
      <div style={styles.groupContainer}>
        {group && comments && isPrivateMember && (
          <div className="m-1">
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
                {isCreator && group.groupAccess === "Private" && (
                  <Col>
                    <Button onClick={toggleInviteModal}>Invite</Button>
                  </Col>
                )}
                {currentUser && (
                  <>
                    <Col>
                      <Members
                        groupMembers={groupMembers}
                        func={updateGroup}
                        isCreator={isCreator}
                        creatorUserId={group.creatorUserId}
                      />
                    </Col>
                    <Col>
                      <Button onClick={redirectToCommentPage}>Comment</Button>
                    </Col>
                  </>
                )}
              </Row>
            </Container>
            <Container className="mt-2">
              {comments.map((commentObject) => (
                <Comment
                  key={commentObject.id}
                  commentObject={commentObject}
                  func={updateGroup}
                  isCreator={isCreator}
                />
              ))}
            </Container>
            <Invite
              showModal={toggleInviteModal}
              show={showInviteModal}
              group={group}
              updateGroup={updateGroup}
            />
          </div>
        )}
        {group && comments && !isPrivateMember && (
          <Container style={{ paddingTop: "8rem" }}>
            <Row>
              <div>Sorry, this group is private</div>
            </Row>
          </Container>
        )}
        {!group && (
          <div style={styles.spinnerDiv}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
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
