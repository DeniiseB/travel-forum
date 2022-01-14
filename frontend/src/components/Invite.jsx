import { Button, Modal } from "react-bootstrap";

function Invite(props) {

  function handleClose() {
    props.showModal();
  }

  return (
    <Modal onHide={handleClose} show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>Invite members</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Invite;
