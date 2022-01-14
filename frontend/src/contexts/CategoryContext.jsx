import React from "react";
import { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

const CategoryContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [categoriesWithGroups, setCategoriesWithGroups] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getCategoriesWithGroups();
  }, []);

  const getCategories = async () => {
    try {
      let res = await fetch("/rest/categories");
      let data = await res.json();
      setCategories(data);
    } catch {
      console.log("Fetching categories failed");
    }
  };

  const getCategoriesWithGroups = async () => {
    let res = await fetch("/rest/groupsxcategories");
    let data = await res.json();
    setCategoriesWithGroups(data);
  };

  const getGroupIdsByCategoryId = async (categoryId) => {
    let res = await fetch("/rest/groupsxcategories/" + categoryId);
    let data = await res.json();
    return data
  };

  const postToGroupsXCategories = async (rowToPost) => {
    try {
      let res = await fetch("/rest/groupsxcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(rowToPost),
      });
      return await res.json();
    } catch {
      console.log("Posting row failed");
    }
  };

  const getCategoryById = async (id) => {
    try {
      let res = await fetch("/rest/categories/" + id);
      return res.json();
    } catch {
      console.log("Fetching category failed");
    }
  };

  const values = {
    categories,
    getCategoryById,
    categoriesWithGroups,
    postToGroupsXCategories,
    getGroupIdsByCategoryId,
  };

  return (
    <CategoryContext.Provider value={values}>
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
