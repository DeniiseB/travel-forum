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
      <div style={styles.homeContainer}>
        {currentUser === null ? (
          <div>
            <div style={styles.titlesContainer}>
              <p>Categories</p>
              <p>Groups</p>
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
                <div style={styles.titlesContainer}>
              <div>Categories</div>
              <div>Groups</div>                 
              </div>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

const styles = {
  titlesContainer: {
    margin: "1.5rem 1rem 0 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: "1.2em",
    textDecoration: "underline",
    color: "#424242",
  },
  homeContainer: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
  },
};
