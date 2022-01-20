import React, { useState } from 'react'
import { Modal, Button, ButtonGroup } from 'react-bootstrap'
import UpdateInvestorShare from './UpdateInvestorShare'
import AddNewToken from './AddNewToken'


function Manage(props) {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        Manage
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
        <ButtonGroup>
        <UpdateInvestorShare fundID={props.fundID}/>
        <AddNewToken fundID={props.fundID}/>
        </ButtonGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Manage
