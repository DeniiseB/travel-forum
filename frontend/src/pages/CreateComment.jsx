import React from "react";
import { Button } from "react-bootstrap";
import ReactQuill from "react-quill"; // ES6
import "react-quill/dist/quill.snow.css"; // ES6
import { useState, useContext, useEffect } from "react";
import { useGroupContext } from "../contexts/GroupContext";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useParams } from "react-router-dom";

function CreateComment() {
  const history = useHistory();
  const { groupid } = useParams();
  const {
    postNewComment,
    fetchGroupById,
    putCommentInGroup,
    addUserIdToGroupMembers,
  } = useGroupContext();
  const { currentUser, addGroupIdToJoinedGroupIds } = useContext(UserContext);
  const [text, setText] = useState();
  const [group, setGroup] = useState({});

  useEffect(() => {
    getAndSetGroup();
  }, [groupid]);

  async function getAndSetGroup() {
    const fetchedGroup = await fetchGroupById(groupid);
    setGroup(fetchedGroup);
  }

  async function postComment() {
    let commentContent = text;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const firstComment = {
      userId: currentUser.id,
      date: date,
      content: commentContent,
      author: currentUser.username,
    };
    let res = await postNewComment(firstComment);
    let commentObject = res;
    await putCommentInGroup(commentObject.id, group);
    if (!groupContainsMember()) {
      await updateUserJoinedGroups();
      await updateGroupsGroupMembers();
    }
    history.push("/group/" + group.id);
  }

  async function updateUserJoinedGroups() {
    let userJoinedGroupIds = currentUser.joinedGroups.length
      ? currentUser.joinedGroups.split(" ")
      : [];

    userJoinedGroupIds.push(groupid);

    let groupObject = {
      userId: currentUser.id,
      groupIds: userJoinedGroupIds.join(" "),
    };

    await addGroupIdToJoinedGroupIds(groupObject);
  }

  async function updateGroupsGroupMembers() {
    let groupMemberIds = group.groupMembers.length
      ? group.groupMembers.split(" ")
      : [];

    groupMemberIds.push(currentUser.id.toString());

    let groupObject = {
      groupId: groupid,
      userIds: groupMemberIds.join(" "),
    };

    await addUserIdToGroupMembers(groupObject);
  }

  const groupContainsMember = () => {
    const groupMemberIds = group.groupMembers.split(" ");
    for (let id of groupMemberIds) {
      if (id === currentUser.id.toString()) {
        return true;
      }
    }
    return false;
  };

  const handleChange = (value) => {
    setText(value);
  };

  return (
    <div>
      <div style={styles.commentContainer}>
        <div style={styles.quillContainer}>
          <ReactQuill value={text || ""} onChange={handleChange} />
        </div>
        <div>
          <Button onClick={postComment} style={{ marginTop: "1rem" }}>
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
export default CreateComment;

const styles = {
  commentContainer: {
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    color: "#424242",
    display: "flex",
    flexDirection: "column",
    margin: "1rem",
    paddingBottom: "8rem",
  },
  quillContainer: {
    marginTop: "2rem",
    backgroundColor: "#ffffffa8",
    borderRadius: "4px",
  },
};
