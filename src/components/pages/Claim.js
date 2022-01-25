import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { StakeAddress } from '../../config'
import StakeAbi from '../../abi/StakeAbi'

async function claimFromStake(rebase, web3, accounts){
  const fetchContract = new web3.eth.Contract(StakeAbi, StakeAddress)
  fetchContract.methods.claim(accounts[0], rebase)
  .send({
    from:accounts[0]
  })
}

function Claim(props) {
  const [rebase, setRebase] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  return(
    <Form>
    <Form.Check
    type="switch"
    label={`${rebase ? 'Turn off rebase':'Turn on rebase' }`}
    id="switch-rabase"
    onClick={() => {setRebase(!rebase)}}
    />
    <Form.Group>
    {
      web3
      ?
      (
        <Button
         variant="outline-primary"
         onClick={() => claimFromStake(rebase, web3, accounts)}>
        Claim
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

export default inject('MobXStorage')(observer(Claim))
