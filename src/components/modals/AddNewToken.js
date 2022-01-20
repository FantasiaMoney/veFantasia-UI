import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
// import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { isAddress } from 'web3-utils'
import { ApiEndpoint } from '../../config'

async function addNewToken(fundID, tokenAddress, password){
  if(!isAddress(tokenAddress))
    return alert("Not correct address")

  const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Authorization': 'Bearer ' + process.env.REACT_APP_API_TOKEN
    }
  }

  try{
    const tokens = [tokenAddress]
    const body = { tokens:JSON.stringify(tokens), fundID, password }
    await axios.post(ApiEndpoint + '/add-fund-tokens/', body, axiosConfig)
  }catch(err){
    console.log("err", err)
    return alert("Server error")
  }

  alert("Done")
  window.location.reload()
}

function AddNewToken(props) {
  const [show, setShow] = useState(false)
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        Tokens
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>

        <Form.Group>
          <Form.Label>Token address</Form.Label>
          <Form.Control type="text" onChange={(e) => setAddress(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Fund password</Form.Label>
          <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group>
        <Button variant="outline-success" onClick={() => addNewToken(props.fundID, address, password)}>Add</Button>
        </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddNewToken
// export default inject('MobXStorage')(observer(Deposit))
