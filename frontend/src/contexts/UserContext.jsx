import React from "react";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const register = async (user) => {
    let res = await fetch("/rest/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });

    return res;
  };

  const login = async (credentials) => {
    let res = await fetch("/rest/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });
    console.log(res);
    await getCurrentUser();
    return res;
  };

  const getCurrentUser = async () => {
    let res = await fetch("/rest/login");
    let user = await res.json();
    console.log("role is ", user.role)
    if (user.username) {
      setCurrentUser(user);
    }
    console.log("current user is ", user);
    return user;
  };

  const logout = async () => {
    let res = await fetch("/rest/login", {
      method: "DELETE",
    });
    setCurrentUser(null);
    return res;
  };

  const getUserById = async (id) => {
    try {
      let res = await fetch("/rest/users/" + id);
      let resJson = await res.json();
      return resJson.data;
    } catch {
      console.log("Fetching user failed");
    }
  };

  const getUserByUserName = async (userName) => {
    try {
      let res = await fetch("/rest/users/name/" + userName);
      let resJson = await res.json();
      return resJson.data;
    } catch {
      console.log("Fetching user failed");
    }
  };

  const addGroupIdToJoinedGroupIds = async (groupObject) => {
    try {
      let res = await fetch("/api/user/joinedgroup/" + groupObject.userId, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ groupIds: groupObject.groupIds }),
      });
      return await res.json();
    } catch {
      console.log("Updating user joinedGroups failed");
    }
  };

  const addGroupToJoinedGroupsAndCreatedGroups = async (groupObject) => {
    try {
      let res = await fetch("/api/user/createdgroup/" + groupObject.userId, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          createdGroupIds: groupObject.createdGroupIds,
          joinedGroupIds: groupObject.joinedGroupIds,
        }),
      });
      return await res.json();
    } catch {
      console.log("Updating user joinedGroups failed");
    }
  };


  const deleteUser = async (userId) => {
    let res = await fetch("/rest/users/" + userId, {
      method: "DELETE",
      headers: { "content-type": "application/json" }
    });
    console.log(await res.json());
    return res
  };

  const removeFromGroup = async (userId) => {
    let res = await fetch("/rest/users/" + userId, {
      method: "PATCH",
      headers: { "content-type": "application/json" }
    });
    console.log(await res.json());
    return res
  };

  const blockUser = async (userId) => {
    let res = await fetch("/rest/users/block/" + userId, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
    });
    console.log(await res.json());
    return res;
  };

  const unblockUser = async (userId) => {
    let res = await fetch("/rest/users/unblock/" + userId, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
    });
    console.log(await res.json());
    return res;
  };

  const values = {
    register,
    login,
    currentUser,
    logout,
    getUserById,
    getUserByUserName,
    addGroupIdToJoinedGroupIds,
    addGroupToJoinedGroupsAndCreatedGroups,
    getCurrentUser,
    deleteUser,
    blockUser,
    unblockUser,
    removeFromGroup,
  };

  return (
    <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
  );
};

export default UserContextProvider;
