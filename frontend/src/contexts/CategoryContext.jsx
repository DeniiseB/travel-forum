import React from "react";
import { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

const CategoryContextProvider = (props) => {
  const [categoriesWithGroups, setCategoriesWithGroups] = useState(null);
  
  useEffect(() => {
    getCategoriesWithGroups()
  }, []);

 
  const getCategoriesWithGroups = async () => {
    let res = await fetch("/rest/groupsxcategories");
    let data = await res.json();
    console.log(data, 'data / categories')
    setCategoriesWithGroups(data);
  };


  const values = {
    categoriesWithGroups,
  };

  return (
    <CategoryContext.Provider value={values}>{props.children}</CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
