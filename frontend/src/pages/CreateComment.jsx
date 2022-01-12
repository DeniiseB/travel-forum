import React from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import { useState, useContext } from "react";
function CreateComment() {

  const [text, setText] = useState();
  
  
  const handleChange = (value) => {
    setText(value);
   }

  function submit() {
     console.log(text)
   }
  return (
    <div>
      <div>
        <ReactQuill value={text}
          onChange={handleChange}/>
        
      </div>
      <div>
        <button onClick={submit}>Post Comment</button>
      </div>
     
    </div>
  );
}
export default CreateComment;