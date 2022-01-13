import React, { createContext, useContext, useState, useEffect } from "react";

const GroupContext = createContext("");

export const useGroupContext = () => {
  return useContext(GroupContext);
};

const GroupProvider = (props) => {
  const [groups, setGroups] = useState([]);

  const fetchAllGroups = async () => {
    try {
      let res = await fetch("/rest/groups");
      setGroups(await res.json());
    } catch {
      console.log("Fetching all groups failed");
    }
  };

  const fetchGroupById = async (groupId) => {
    try {
      let res = await fetch("/rest/groups/" + groupId);
      let resJson = await res.json();
      return resJson.data;
    } catch {
      console.log("Fetching group by ID failed");
    }
  };

  const postNewGroup = async (groupToPost) => {
    try {
      let res = await fetch("/rest/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(groupToPost),
      });
      return await res.json();
    } catch {
      console.log("Posting group failed");
    }
  };

  const fetchCommentById = async (commentId) => {
    try {
      let res = await fetch("/rest/comments/" + commentId);
      let resJson = await res.json();
      return resJson.data;
    } catch {
      console.log("Fetching comment by ID failed");
    }
  };

  const postNewComment = async (commentToPost) => {
    try {
      let res = await fetch("/rest/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(commentToPost),
      });
      return await res.json();
    } catch {
      console.log("Posting comment failed");
    }
  };

  const values = {
    groups,
    fetchGroupById,
    postNewGroup,
    fetchCommentById,
    postNewComment,
  };

  return (
    <GroupContext.Provider value={values}>
      {props.children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
