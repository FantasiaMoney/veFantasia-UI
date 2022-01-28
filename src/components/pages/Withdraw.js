import React, { useState, useEffect } from 'react'
import { Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { StakeAddress, SohmAddress } from '../../config'
import StakeAbi from '../../abi/StakeAbi'
import SohmAbi from '../../abi/SohmAbi'

async function withdrawFromStake(amount, useMax, maxAmount, web3, accounts){
  const amountToWithdraw = useMax ? maxAmount : amount

  if(amountToWithdraw <= 0)
    return alert("Wrong amount")

  const stakeContract = new web3.eth.Contract(StakeAbi, StakeAddress)
  stakeContract.methods.unstake(
    accounts[0],
    amountToWithdraw,
    true,
    true
  ).send({ from:accounts[0] })
}

async function getData(web3, accounts){
  const sohmContract = new web3.eth.Contract(SohmAbi, SohmAddress)
  const myApproved = await sohmContract.methods.allowance(StakeAddress, accounts[0]).call()
  const mySohmShares = await sohmContract.methods.balanceOf(accounts[0]).call()

  return {
    mySohmShares,
    myApproved
  }
}

async function unlock(web3, accounts){
  const sohmContract = new web3.eth.Contract(SohmAbi, SohmAddress)
  sohmContract.methods.approve(
    StakeAddress,
    "10000000000000000000000000000000000000000000000000"
  ).send({ from:accounts[0] })
}

async function setMax(setUseMax, setAmount, maxAmount){
  setUseMax(true)
  setAmount(Number(maxAmount) / (10**9))
}

function Withdraw(props) {
  const [amount, setAmount] = useState(0)
  const [approved, setApproved] = useState(0)
  const [myShares, setMyShares] = useState(false)
  const [useMax, setUseMax] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    async function loadData() {
      if(web3){
        const {
          mySohmShares,
          myApproved
        } = await getData(web3, accounts)

        // update states
        setApproved(myApproved)
        setMyShares(mySohmShares)
      }
    }

    loadData()
  }, [web3, accounts])

  return(
    <Form>
    <Form.Group>
    {
      web3
      ?
      (
        <>
        <Form.Group>
          <Alert variant="info">
          Your shares : {Number(myShares) / (10**9)}
          </Alert>
          <br/>
          <Form.Label>Input shares amount</Form.Label>
          <InputGroup size="lg">
          <Form.Control
           type="number"
           min="0"
           value={amount}
           onChange={(e) => setAmount(e.target.value)}
          />

          <InputGroup.Text>
          <Button
           variant="outline-primary"
           size="sm"
           onClick={() => setMax(setUseMax, setAmount, myShares)}>
          Withdraw Max
          </Button>
          </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group>

        {
          Number(approved) > Number(myShares)
          ?
          (
            <Button
             variant="outline-primary"
             onClick={() => withdrawFromStake(
               Number(amount * (10**9)).toFixed(),
               useMax,
               myShares,
               web3,
               accounts
             )}>
             Withdraw
            </Button>
          )
          :
          (
            <Button
             variant="outline-warning"
             onClick={() => unlock(
               web3,
               accounts
             )}
            >
             Unlock
            </Button>
          )
        }
        </Form.Group>
        </>
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
