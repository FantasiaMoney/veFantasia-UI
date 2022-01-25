import React, { useState, useEffect } from 'react'
import { Form, Button, Alert, Card } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { StakeAddress, SohmAddress } from '../../config'
import StakeAbi from '../../abi/StakeAbi'
import SohmAbi from '../../abi/SohmAbi'

async function withdrawFromStake(amount, web3, accounts){
  if(Number(amount) <= 0)
    return alert("Wrong amount")

  const stakeContract = new web3.eth.Contract(StakeAbi, StakeAddress)
  stakeContract.methods.unstake(
    accounts[0],
    amount,
    true,
    true
  ).send({ from:accounts[0] })
}

async function getData(web3, accounts){
  const sohmContract = new web3.eth.Contract(SohmAbi, SohmAddress)
  const mySohmShares = await sohmContract.methods.balanceOf(accounts[0]).call()
  return {
    mySohmShares
  }
}

function Withdraw(props) {
  const [amount, setAmount] = useState(0)
  const [myShares, setMyShares] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    async function loadData() {
      if(web3){
        const {
          mySohmShares,
        } = await getData(web3, accounts)

        // update states
        setMyShares(mySohmShares)
      }
    }

    loadData()
  }, [web3, accounts])

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
        <Form.Group>
        <Button
         variant="outline-primary"
         onClick={() => withdrawFromStake(
           Number(amount * (10**9)).toFixed(),
           web3,
           accounts
         )}>
         Withdraw
        </Button>
        <br/>
        <br/>

        <Card body>
        Your shares : {Number(myShares) / (10**9)}
        </Card>
        <br/>

        <Button
         variant="outline-primary"
         onClick={() => withdrawFromStake(myShares, web3, accounts)}>
        Withdraw Max
        </Button>
        </Form.Group>
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
