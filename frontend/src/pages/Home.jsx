import React from 'react';
import CategoryCard from '../components/CatergoryCard';
import { CategoryContext } from '../contexts/CategoryContext';
import { useState, useContext } from "react";
import { Link } from 'react-router-dom';

function Home() {

  const { categories } = useContext(CategoryContext);

  console.log(categories)
 

  return (
    <div className="Home">
      <h2 style={styles.catergoryTitle}>Categories</h2>
      <h5 style={styles.groupAmountTitle}>Group Amount</h5>
      {!categories ? (
        <div></div>
      ) : (
        <div>
          {categories.map((item, index) => (
            <Link to={"/inside-category/"+ item.id}>
              <CategoryCard props={item} key={index} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


export default Home;

const styles = {
  catergoryTitle: {
    marginTop: "2vh",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
  },
  groupAmountTitle: {
    marginTop: "2vh",
    marginLeft: "250px",
    marginRight: "5vw",
  }
}