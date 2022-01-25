import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { StakeAddress } from '../../config'
import StakeAbi from '../../abi/StakeAbi'

async function withdrawFromStake(amount, web3, accounts){
  if(Number(amount) <= 0)
    return alert("Wrong amount")

  const stakeContract = new web3.eth.Contract(StakeAbi, StakeAddress)
  stakeContract.methods.unstake(
    accounts[0],
    amount * 10**9,
    true,
    true
  )
  .send({
    from:accounts[0],
    value:web3.utils.toWei(String(amount))
  })
}

function Withdraw(props) {
  const [amount, setAmount] = useState(0)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  return(
    <Form>
    <Form.Group>
      <Form.Label>Input shares amount</Form.Label>
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
         onClick={() => withdrawFromStake(amount, web3, accounts)}>
        Withdraw
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

export default inject('MobXStorage')(observer(Withdraw))
