import React from "react";
import CategoryCard from "../components/CatergoryCard";
import { CategoryContext } from "../contexts/CategoryContext";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import MyGroups from "./MyGroups";
import { UserContext } from "../contexts/UserContext"

function Home() {
  const { categoriesWithGroups } = useContext(CategoryContext);
  const { currentUser } = useContext(UserContext)

  return (
    <div className="Home">
      {currentUser === null ? (
         <div>
         <h2 style={styles.catergoryTitle}>Categories</h2>
         <h5 style={styles.groupAmountTitle}>Groups</h5>
         {!categoriesWithGroups ? (
           <div></div>
         ) : (
           <div style={styles.list}>
             {categoriesWithGroups.map((item, index) => (
              <Link to={"/inside-category/"+ item.id}>
               <CategoryCard props={item} key={index} />
               </Link>
             ))}
           </div>
         )}
         </div>
      ) : (
        <div>
        <div><MyGroups/></div>
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
  list: {
    marginTop:"8vh"
  }
};
