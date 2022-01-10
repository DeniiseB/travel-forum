import { table } from "react-bootstrap";

function InsideCategory() {
  return (
    <div className="App">
      <table className="table table-hover" style={styles.categoriesTable}>
        <thead>
          <tr>
            <th scope="colSpan">
              <h1>Categories</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Group name</th>
          </tr>
          <tr>
            <th scope="row">Group name</th>
          </tr>
          <tr>
            <th scope="row">Group name</th>
          </tr>
          <tr>
            <th scope="row">Group name</th>
          </tr>
          <tr>
            <th scope="row">Group name</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default InsideCategory;

const styles = {
  categoriesTable: {
    width: "15rem",
    border: "solid lightGrey 1px",
    borderRadius: "4px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop:"5rem",
  },
};
