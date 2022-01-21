import { Table, Spinner } from "react-bootstrap";
import { CategoryContext } from "../contexts/CategoryContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroupContext } from "../contexts/GroupContext";
import { Link } from "react-router-dom";

function InsideCategory() {
  const { getCategoryById, getGroupIdsByCategoryId } =
    useContext(CategoryContext);
  const { id } = useParams();
  const [category, setCategory] = useState({});
  const [groups, setGroups] = useState([]);
  const { fetchGroupById } = useGroupContext();

  useEffect(() => {
    fetchCategory();
  }, [id]);

  async function fetchCategory() {
    const fetchedCategory = await getCategoryById(id);
    setCategory(fetchedCategory.data);

    await fetchGroups();
  }

  async function fetchGroups() {
    const fetchedGroupIds = await getGroupIdsByCategoryId(id);
    const groupsArray = [];
    for (let idObject of fetchedGroupIds) {
      let group = await fetchGroupById(idObject.groupId);
      groupsArray.push(group);
    }
    setGroups(groupsArray);
  }

  return (
    <div className="App">
      <div style={styles.createGroupContainer}>
        <Link to="/create-group">
          <div style={styles.createGroup}>Create group</div>
        </Link>
      </div>
      {category && (
        <Table className="table table-hover" style={styles.categoriesTable}>
          <thead>
            <tr>
              <th scope="colSpan">
                <div style={styles.categoryName}>
                  <p> {category.name}</p>
                </div>
              </th>
            </tr>
          </thead>
          {groups && (
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <Link to={"/group/" + group.id}>
                    {" "}
                    <th scope="row">
                      <div style={styles.groupName}>{group.groupName}</div>
                    </th>
                  </Link>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      )}
      {!category && (
        <div>
          <Spinner animation="grow" variant="dark" />
        </div>
      )}
    </div>
  );
}

export default InsideCategory;

const styles = {
  categoriesTable: {
    width: "15rem",
    borderRadius: "4px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "3rem",
    backgroundColor: "#424242c9",
    color: "white",
  },
  categoryName: {
    marginTop: "0.8rem",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "600",
    fontSize: "1.2em",
  },
  groupName: {
    margin: "0.5rem",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "500",
    fontSize: "1em",
    color: "white",
  },
  createGroupContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  createGroup: {
    border: "solid 1px #424242",
    borderRadius: "4px",
    textDecoration: "none",
    color: "#424242",
    fontFamily: "Montserrat, sans-serif",
    fontStyle: "italic",
    fontWeight: "500",
    fontSize: "1em",
    padding: "0.4rem",
    margin: "1rem",
  },
};
