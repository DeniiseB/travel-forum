import { table } from "react-bootstrap";

function InsideCategory() {
  return (
    <div className="App">
      <h1>Categories</h1>
      <table className="table table-bordered" bordered="true">
        <thead>
          <tr>
            <th scope="colSpan">#</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
          </tr>
          <tr>
            <th scope="row">2</th>
          </tr>
          <tr>
            <th scope="row">3</th>
          
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default InsideCategory;
