import React from "react";
import { createContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export const UserContext = createContext();

const UserContextProvider = (props) => {

    useEffect(async () => {
      await getCurrentUser();
    }, []);

   const [currentUser, setCurrentUser] = useState(null);


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
    await getCurrentUser()
     return res;
  }

  const getCurrentUser=async () => {
    let res = await fetch("/rest/login");
    let user = await res.json()
    if (user.username) {
       setCurrentUser(user)
    }
    console.log("current user is ", user)
     return res;
  }


   const logout = async () => {
     let res = await fetch("/rest/login", {
       method: "DELETE"
     });
     setCurrentUser(null)
     return res;
   };











const values = {
  register,
  login,
  currentUser,
  logout,
};

return (
  <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
);
}


export default UserContextProvider;