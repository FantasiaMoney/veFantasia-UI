import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { isAddress } from 'web3-utils'
import axios from 'axios'
import { ApiEndpoint, CURRENCY } from '../../config'


async function createNewFund(name, address, password){
  if(name === "")
    return alert("Not correct name")

  if(!isAddress(address))
    return alert("Not correct address")

  const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Authorization': 'Bearer ' + process.env.REACT_APP_API_TOKEN
    }
  }

  try{
    const body = { address, name, password }
    await axios.post(ApiEndpoint + '/add-new-fund/', body, axiosConfig)
  }catch(err){
    return alert("Server error")
  }

  alert("Done")
  window.location.reload()
}

function Deposit() {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  return(
    <Form>
    <Form.Group>
      <Form.Label>Fund name</Form.Label>
      <Form.Control type="text" onChange={(e) => setName(e.target.value)} />
    </Form.Group>

    <Form.Group>
      <Form.Label>Fund address</Form.Label>
      <br/>
      <Form.Label><small>{CURRENCY} wallet or smart contract address by which investors' assets will be calculated</small></Form.Label>
      <Form.Control type="text" onChange={(e) => setAddress(e.target.value)} />
    </Form.Group>

    <Form.Group>
      <Form.Label>Fund password</Form.Label>
      <br/>
      <Form.Label><small>password for manage fund, note: this password can't be restored</small></Form.Label>
      <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
    </Form.Group>

    <Form.Group>
    <Button
     variant="outline-success"
     onClick={() => createNewFund(name, address, password)}>Create</Button>
    </Form.Group>
    </Form>
  )
}

export default Deposit
