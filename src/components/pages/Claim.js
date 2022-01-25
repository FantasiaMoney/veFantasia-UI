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
  const sohmContract = new web3.eth.Contract(SohmAbi, SohmAddress)
  const mySohmShares = await sohmContract.methods.balanceOf(accounts[0]).call()
  const totalSohmShares = await sohmContract.methods.totalSupply().call()
  return {
    mySohmShares,
    totalSohmShares
  }
}

function Claim(props) {
  // const [rebase, setRebase] = useState(false)
  const [myShares, setMyShares] = useState(false)
  const [totalShares, setTotalShares] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    async function loadData() {
      if(web3){
        const {
          mySohmShares,
          totalSohmShares
        } = await getData(web3, accounts)

        // update states
        setMyShares(mySohmShares)
        setTotalShares(totalSohmShares)
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
        Total shares : {Number(totalShares) / (10**9)}
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
