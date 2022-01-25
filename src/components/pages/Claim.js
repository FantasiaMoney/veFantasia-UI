import React, { useState, useEffect } from 'react'
import { Form, Button, Alert, Card } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { StakeAddress, SohmAddress } from '../../config'
import StakeAbi from '../../abi/StakeAbi'
import SohmAbi from '../../abi/SohmAbi'

async function claimFromStake(web3, accounts){
  const stakeContract = new web3.eth.Contract(StakeAbi, StakeAddress)
  stakeContract.methods.claim(accounts[0], true)
  .send({
    from:accounts[0]
  })
}

async function getData(web3, accounts){
  console.log("Get data")
  const sohmContract = new web3.eth.Contract(SohmAbi, SohmAddress)
  const mySohmShares = await sohmContract.methods.balanceOf(accounts[0]).call()
  return {
    mySohmShares
  }
}

function Claim(props) {
  // const [rebase, setRebase] = useState(false)
  const [myShares, setMyShares] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    async function loadData() {
      console.log("Trigger", web3)
      if(web3){
        console.log("Trigger2 ")
        const { mySohmShares } = await getData(web3, accounts)
        console.log("mySohmShares", mySohmShares)
        setMyShares(mySohmShares)
      }
    }

    loadData()
  }, [web3, accounts])

  return(
    <Form>
    {
      /*
      <Form.Check
      type="switch"
      label={`${rebase ? 'Turn off rebase':'Turn on rebase' }`}
      id="switch-rabase"
      onClick={() => {setRebase(!rebase)}}
      />
      */
    }

    {
      web3
      ?
      (
        <Form.Group>
        <Card body>
        Your shares : {Number(myShares) / (10**9)}
        </Card>
        <br/>
        <Card body>
        Your rewards : {Number(myShares) / (10**9)}
        </Card>
        <br/>
        <Button
         variant="outline-primary"
         onClick={() => claimFromStake(web3, accounts)}>
        Claim
        </Button>
        </Form.Group>
      )
      :
      (
        <Alert variant="warning">Please connect wallet</Alert>
      )
    }
    </Form>
  )
}

export default inject('MobXStorage')(observer(Claim))
