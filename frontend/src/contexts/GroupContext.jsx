import React, { createContext, useContext, useState } from "react";

const GroupContext = createContext("");

export const useGroupContext = () => {
  return useContext(GroupContext);
};

const GroupProvider = (props) => {
  const [groups, setGroups] = useState([]);

  const fetchAllGroups = async () => {
    try {
      let res = await fetch("/rest/groups");
      console.log(res);
      let data = await res.json();
      setGroups(data);
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

  const addUserIdToGroupMembers = async (groupObject) => {
    try {
      let res = await fetch("/api/groups/" + groupObject.groupId, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userIds: groupObject.userIds }),
      });
      return await res.json();
    } catch {
      console.log("Updating groupMembers failed");
    }
  };

  const putCommentInGroup = async (commentId, group) => {
    let string = group.commentIds + " " + commentId;
    let newString = { str: string };
    try {
      let res = await fetch("/rest/groups/" + group.id, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newString),
      });
      return await res.json();
    } catch {
      console.log("Posting comment failed");
    }
  };

  const getCreatedGroups = async (userId) => {
    let res = await fetch("/rest/created-groups/" + userId);
    return res;
  };

  const getJoinedGroups = async (userId) => {
    let res = await fetch("/rest/joined-groups/" + userId);
    return res;
  };

  const getJoinedAndCreatedGroups = async (userId) => {
    let createdRes = await getCreatedGroups(userId);
    let joinedRes = await getJoinedGroups(userId);
    let arr = [];
    if (createdRes.status === 200) {
      createdRes = await createdRes.json();
      console.log(createdRes);
      arr.push(createdRes);
    }
    if (joinedRes.status === 200) {
      joinedRes = await joinedRes.json();

      arr.push(joinedRes);
    }
    console.log(arr);
    return arr;
  };


   const deleteSpecificGroup = async (groupId) => {
    try {
      let res = await fetch("/rest/groups/" + groupId, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });
      console.log(await res.json())
      return  res;
    } catch {
      console.log("Deleting group failed");
    }
  };

     const deleteSpecificComment = async (commentId) => {
       try {
         let res = await fetch("/rest/comments/" + commentId, {
           method: "DELETE",
           headers: { "content-type": "application/json" },
         });
         console.log(await res.json());
         return res;
       } catch {
         console.log("Deleting group failed");
       }
     };
  
  const values = {
    groups,
    fetchGroupById,
    postNewGroup,
    fetchCommentById,
    postNewComment,
    addUserIdToGroupMembers,
    putCommentInGroup,
    getJoinedAndCreatedGroups,
    deleteSpecificGroup,
    deleteSpecificComment,
  };

  return (
    <GroupContext.Provider value={values}>
      {props.children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
