import React from "react";
import { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

const CategoryContextProvider = (props) => {
  const [categories, setCategories] = useState(null);
  
  useEffect(() => {
    getCategories()
  }, []);

 
  const getCategories = async () => {
    let res = await fetch("/rest/categories");
    let data = await res.json();
    console.log(data, 'data / categories')
    setCategories(data)
  };


  const values = {
    categories,
  };

  return (
    <CategoryContext.Provider value={values}>{props.children}</CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
