import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { CURRENCY, FetchAddress } from '../../config'
import FetchAbi from '../../abi/FetchAbi'

async function depositToFetch(amount, web3, accounts){
  if(Number(amount) <= 0)
    return alert("Wrong amount")

  const fetchContract = new web3.eth.Contract(FetchAbi, FetchAddress)
  fetchContract.methods.convert()
  .send({
    from:accounts[0],
    value:web3.utils.toWei(String(amount))
  })
}

function Deposit(props) {
  const [amount, setAmount] = useState(0)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  return(
    <Form>
    <Form.Group>
      <Form.Label>Input { CURRENCY } amount</Form.Label>
      <Form.Control
       type="number"
       min="0"
       onChange={(e) => setAmount(e.target.value)}
      />
    </Form.Group>

    <Form.Group>
    {
      web3
      ?
      (
        <Button
         variant="outline-primary"
         onClick={() => depositToFetch(amount, web3, accounts)}>
        Deposit
        </Button>
      )
      :
      (
        <Alert variant="warning">Please connect wallet</Alert>
      )
    }

    </Form.Group>
    </Form>
  )
}

export default inject('MobXStorage')(observer(Deposit))
