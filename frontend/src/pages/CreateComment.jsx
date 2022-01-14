import React from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import { useState, useContext } from "react";
import { useGroupContext } from "../contexts/GroupContext";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
function CreateComment() {

  const [text, setText] = useState();
  const { postNewComment } = useGroupContext();
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  
  async function postComment() {
    let commentContent = text;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const firstComment = {
      userId: currentUser.id,
      date: date,
      content: commentContent,
    };
    let res = await postNewComment(firstComment);
    let commentObject = res;
    console.log(commentObject.id)
    //commentObject is the id to pass to group.commentId
    //then use history to go back to group page? or start page?
  }

  const handleChange = (value) => {
    setText(value);
   }

   
  return (
    <div>
      <div>
        <ReactQuill value={text || ''}
          onChange={handleChange}/>
        
      </div>
      <div>
        <button onClick={postComment}>Post Comment</button>
      </div>
     
    </div>
  );
}
export default CreateComment;