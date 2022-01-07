import React from "react";
import { createContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export const UserContext = createContext();

const UserContextProvider = (props) => {


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
     return res;
  }











const values = {
  register,
  login
};

return (
  <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
);
}


export default UserContextProvider;