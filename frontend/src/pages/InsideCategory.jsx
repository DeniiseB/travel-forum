import { Table } from "react-bootstrap";
import { CategoryContext } from "../contexts/CategoryContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function InsideCategory() {
  const fakeArray = ["French speaker", "Fishing friend", "Travel buddy"];
  const { getCategoryById } = useContext(CategoryContext);
  const { id } = useParams();
  const [category, setCategory] = useState({});

  useEffect(() => {
    fetchCategory();
  }, []);

  async function fetchCategory() {
    const fetchedCategory = await getCategoryById(id);
    setCategory(fetchedCategory.data)
  }

  return (
    <div className="App">
      {category && 
        <Table className="table table-hover" style={styles.categoriesTable}>
          <thead>
            <tr>
              <th scope="colSpan">
                <h1> {category.name}</h1>
              </th>
            </tr>
          </thead>
          <tbody>
            {fakeArray.map((name) => (
              <tr key={name}>
                <th scope="row">{name}</th>
              </tr>
            ))}
          </tbody>
        </Table>
      }{!category &&
        <div>
          <h1>ADD SPINNER</h1>
      </div>
      }
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
    marginTop: "5rem",
  },
};
