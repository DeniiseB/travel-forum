import React, { createContext, useContext, useState, useEffect } from "react";

const GroupContext = createContext("");

export const useGroupContext = () => {
  return useContext(GroupContext);
};

const GroupProvider = (props) => {
  const [groups, setGroups] = useState([]);

  // useEffect(() => {
  //   fetchAllGroups();
  // }, []);

  const fetchAllGroups = async () => {
    try {
      let res = await fetch("/rest/groups");
      setGroups(await res.json());
    } catch {
      console.log("Fetching all groups failed");
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
      console.log(res)
      return await res.json();
    } catch {
      console.log("Posting comment failed");
    }
  };

  const values = {
    groups,
    postNewGroup,
    postNewComment,
  };

  return (
    <GroupContext.Provider value={values}>
      {props.children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
