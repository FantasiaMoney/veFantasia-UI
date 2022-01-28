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
    {
      web3
      ?
      (
        <>
        <Form.Group>
        <Form.Label>Input { CURRENCY } amount</Form.Label>
        <Form.Control
         type="number"
         min="0"
         value={amount}
         onChange={(e) => setAmount(e.target.value)}
        />
        </Form.Group>
        
        <Form.Group>
        <Button
         variant="outline-primary"
         onClick={() => depositToFetch(amount, web3, accounts)}>
        Deposit
        </Button>
        </Form.Group>
        </>
      )
      :
      (
        <Alert variant="warning">Please connect wallet</Alert>
      )
    }
    </Form>
  )
}

export default inject('MobXStorage')(observer(Deposit))
