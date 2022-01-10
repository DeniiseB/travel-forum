import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Comment from "../components/Comment";

function Group() {
  const { groupid } = useParams();
  const fakeCommentArray = [
    {
      id: 1,
      userId: 8,
      date: "10/01/2022 16:49",
      content:
        "I would like to travel there too! I need to get some cash together first and then I'll be able to go.",
    },
    {
      id: 2,
      userId: 10,
      date: "10/01/2022 16:49",
      content:
        "I would like to travel there too! I need to get some cash together first and then I'll be able to go. I would like to travel there too! I need to get some cash together first and then I'll be able to go. I would like to travel there too! I need to get some cash together first and then I'll be able to go. I would like to travel there too! I need to get some cash together first and then I'll be able to go. I would like to travel there too! I need to get some cash together first and then I'll be able to go.",
    },
    {
      id: 3,
      userId: 8,
      date: "10/01/2022 16:49",
      content:
        "I would like to travel there too! I need to get some cash together first and then I'll be able to go.",
    },
  ];

  return (
    <div>
      <div className="m-2">
        <Container>
          <Row>
            <Col>
              <h2>#groupName</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button>Members</Button>
            </Col>
            <Col>
              <Button>Comment</Button>
            </Col>
          </Row>
        </Container>
        <Container className="mt-2">
          {fakeCommentArray.map((commentObject) => (
            <Comment key={commentObject.id} commentObject={commentObject} />
          ))}
        </Container>
      </div>
    </div>
  );
}

export default Group;

