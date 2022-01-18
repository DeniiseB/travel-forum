import React from "react";
import ReactQuill from "react-quill"; // ES6
import "react-quill/dist/quill.snow.css"; // ES6
import { useState, useContext, useEffect } from "react";
import { useGroupContext } from "../contexts/GroupContext";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useParams } from "react-router-dom";

function CreateComment() {
  const [text, setText] = useState();
  const { postNewComment,fetchGroupById, putCommentInGroup } = useGroupContext();
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  const [group , setGroup ] = useState({});
  const { groupid } = useParams();


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
    history.push("/group/"+group.id)
  }

  const handleChange = (value) => {
    setText(value);
  };

  return (
    <div>
      <div>
        <ReactQuill value={text || ""} onChange={handleChange} />
      </div>
      <div>
        <button onClick={postComment} >Post Comment</button>
      </div>
    </div>
  );
}
export default CreateComment;
