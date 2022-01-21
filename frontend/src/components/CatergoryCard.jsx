import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardTitle, Col } from "reactstrap";
import { useHistory } from "react-router-dom";

function CategoryCard(props) {
  const history = useHistory();

  function redirect() {
    history.push("/inside-category");
  }
  return (
    <Col sm="6">
      <Card onClick={redirect} body style={styles.cardBody}>
        <div style={styles.cardCategory}>
          <CardTitle>{props.props.name}</CardTitle>
        </div>
        <div style={styles.cardOwner}>
          <CardTitle>{props.props.groupAmount}</CardTitle>
        </div>
      </Card>
    </Col>
  );
}
export default CategoryCard;

const styles = {
  cardBody: {
    backgroundColor: "#424242c9",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "600",
    fontSize: "1em",
    color: "white",
    textDecoration: "none",
    marginTop: "0.5rem",
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
};
