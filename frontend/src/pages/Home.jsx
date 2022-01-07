import React from 'react';
import { ListGroup, ListGroupItem, } from 'reactstrap';
import CategoryCard from '../components/CatergoryCard';

function Home() {
  const data = [{ "category": "USA", "groupAmount": 10 }, { "category": "Sweden", "groupAmount": 23 }];

  return (
    <div className="Home">
      <h2 style={styles.catergoryTitle}>Categorys</h2>
      <h5 style={styles.groupAmountTitle}>Group Amount</h5>
      <div>
          {data.map((item, index) => (
            <CategoryCard props={item} key={index} />
          ))}
      </div>
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
  }
}