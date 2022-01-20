import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
// import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { ApiEndpoint } from '../../config'

async function addNewDeposit(fundID, investorID, investorShare, password){
  console.log(fundID, investorID, investorShare, password)
  if(investorShare <= 0)
    return alert("Not correct share")

  const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Authorization': 'Bearer ' + process.env.REACT_APP_API_TOKEN
    }
  }

  try{
    const body = {
      investorID,
      investorShare,
      password,
      fundID
    }

    await axios.post(ApiEndpoint + '/add-new-deposit/', body, axiosConfig)
  }catch(err){
    console.log("err", err)
    return alert("Server error or wrong password")
  }

  alert("Done")
  window.location.reload()
}

function UpdateInvestorShare(props) {
  const [show, setShow] = useState(false)
  const [depositShare, setDepositShare] = useState(0)
  const [investorName, setInvestorName] = useState('')
  const [password, setPassword] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        Investors
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>

        <Form.Group>
          <Form.Label>Investor name</Form.Label>
          <Form.Control type="text" onChange={(e) => setInvestorName(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Investor share</Form.Label>
          <Form.Control type="number" onChange={(e) => setDepositShare(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Fund password</Form.Label>
          <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group>
        <Button
          variant="outline-success"
          onClick={() => addNewDeposit(props.fundID, investorName, depositShare, password)}>Update</Button>
        </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UpdateInvestorShare
// export default inject('MobXStorage')(observer(Deposit))
