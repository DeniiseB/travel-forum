import React from "react";
import CategoryCard from "../components/CatergoryCard";
import { CategoryContext } from "../contexts/CategoryContext";
import { useContext } from "react";

function Home() {
  const { categoriesWithGroups } = useContext(CategoryContext);

  return (
    <div className="Home">
      <h2 style={styles.catergoryTitle}>Categories</h2>
      <h5 style={styles.groupAmountTitle}>Groups</h5>
      {!categoriesWithGroups ? (
        <div></div>
      ) : (
        <div>
          {categoriesWithGroups.map((item, index) => (
            <CategoryCard props={item} key={index} />
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
  },
};
