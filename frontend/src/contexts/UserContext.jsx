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
    if (user.username) {
      setCurrentUser(user);
    }
    console.log("current user is ", user);
    return res;
  };

  const logout = async () => {
    let res = await fetch("/rest/login", {
      method: "DELETE",
    });
    setCurrentUser(null);
    return res;
  };

  const getUserByUserName = async (userName) => {
    try {
      let res = await fetch("/rest/users/" + userName);
      let resJson = await res.json();
      return resJson.data;
    } catch {
      console.log("Fetching user failed");
    }
  };

  const values = {
    register,
    login,
    currentUser,
    logout,
    getUserByUserName,
  };

  return (
    <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
  );
};

export default UserContextProvider;
