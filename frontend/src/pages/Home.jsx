import React from "react";
import CategoryCard from "../components/CatergoryCard";
import { CategoryContext } from "../contexts/CategoryContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import MyGroups from "./MyGroups";
import { UserContext } from "../contexts/UserContext";

function Home() {
  const { categoriesWithGroups } = useContext(CategoryContext);
  const { currentUser } = useContext(UserContext);

  return (
    <div className="Home">
      <div>
        {currentUser === null ? (
          <div>
            <div style={styles.titlesContainer}>
              <h2>Categories</h2>
              <h5>Groups</h5>
            </div>
            {!categoriesWithGroups ? (
              <div></div>
            ) : (
              <div style={styles.list}>
                {categoriesWithGroups.map((item, index) => (
                  <Link to={"/inside-category/" + item.id}>
                    <CategoryCard props={item} key={index} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div>
              <MyGroups />
            </div>
            <div>
              <h2 style={styles.catergoryTitle}>Categories</h2>
              <h5 style={styles.groupAmountTitle}>Groups</h5>
              {!categoriesWithGroups ? (
                <div></div>
              ) : (
                <div style={styles.list}>
                  {categoriesWithGroups.map((item, index) => (
                    <CategoryCard props={item} key={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

const styles = {
  list: {
    marginTop: "2vh",
  },
  titlesContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  homeContainer: {}
};
