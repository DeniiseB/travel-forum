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
    const groupsArray = []
    for (let idObject of fetchedGroupIds) {
      let group = await fetchGroupById(idObject.groupId)
      groupsArray.push(group)
    }
    setGroups(groupsArray)
   }

  return (
    <div className="App">
      <p>
        <Link style={styles.link} to="/create-group">
          Create group
        </Link>
      </p>
      {category && (
        <Table className="table table-hover" style={styles.categoriesTable}>
          <thead>
            <tr>
              <th scope="colSpan">
                <h1> {category.name}</h1>
              </th>
            </tr>
          </thead>
          {groups && (
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <Link style={styles.link2} to={"/group/" + group.id}>
                    {" "}
                    <th scope="row">{group.groupName}</th>
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
    border: "solid lightGrey 1px",
    borderRadius: "4px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "5rem",
  },
  link: {
    textDecoration: "none",
    color: "black",
    marginLeft: "15rem",
  },
  link2: {
    textDecoration: "none",
    color: "black",
  },
};
