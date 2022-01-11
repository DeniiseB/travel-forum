import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';

function CategoryCard(props) {
  
  return (
    <Col sm="6">
      <Card body style={styles.card}>
        <div style={styles.cardCategory}>
          <CardTitle >{props.props.name}</CardTitle>
        </div>
        {/* <div style={styles.cardOwner}>
          <CardTitle>{props.props.groupAmount}</CardTitle>
        </div> */}
      </Card>
    </Col>
  );
}
export default CategoryCard;

const styles = {
  
  card: {
  },
  cardCategory: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
  },
  cardOwner: {
    marginLeft: "250px",
    marginRight: "5vw",
  },
}