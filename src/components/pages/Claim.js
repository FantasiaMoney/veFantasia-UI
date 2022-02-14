import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Form, Alert, Button } from 'react-bootstrap'
import WalletDestributorABI from '../../abi/WalletDestributorABI'
import { inject, observer } from 'mobx-react'
import { fromWei } from 'web3-utils'

import {
  WalletDestributor,
  CURRENCY
} from '../../config'


// helper for convert unix time to date
function fetchDate(unixDate){
  const date = new Date(unixDate * 1000)
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

function claim(web3, accounts){
  const destributor = new web3.eth.Contract(WalletDestributorABI, WalletDestributor)
  destributor.methods.claim().send({ from:accounts[0] })
}

// helper for load data from contracts
async function getData(web3, accounts){
  const destributor = new web3.eth.Contract(WalletDestributorABI, WalletDestributor)
  const _periodStart = await destributor.methods.currentPeriodStart().call()
  const _claimPeriod = await destributor.methods.periodTime().call()
  const currentPeriodIndex = await destributor.methods.currentPeriodIndex().call()
  const _periodClaimed = await destributor.methods.periodClaimed(
    accounts[0],
    currentPeriodIndex
  ).call()

  let _earned = await destributor.methods.earned(accounts[0]).call()
  _earned = _earned > 0 ? fromWei(_earned) : 0

  return {
    _periodStart,
    _claimPeriod,
    _periodClaimed,
    _earned
  }
}


function Claim(props) {
  const [periodStart, setPeriodStart] = useState(0)
  const [claimPeriod, setClaimPeriod] = useState(0)
  const [earned, setEarned] = useState(0)
  const [periodClaimed, setPeriodClaimed] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
       // set states
       if(!isCancelled && web3){
        // get data
        const {
          _periodStart,
          _claimPeriod,
          _periodClaimed,
          _earned
        } = await getData(web3, accounts)

        setPeriodStart(_periodStart)
        setClaimPeriod(_claimPeriod)
        setPeriodClaimed(_periodClaimed)
        setEarned(_earned)

        console.log("_periodClaimed", _periodClaimed)
       }
     }
     loadData()
     return () => {
     isCancelled = true
   }
  }, [web3, accounts])

  return (
    <Form>
    <>
    {
      web3
      ?
      (
        <>
        {
          periodStart !== 0
          ?
          (
            !periodClaimed
            ?
            (
              <>
              <Alert variant="success">Earned {earned} {CURRENCY}</Alert>
              <Button
              variant="outline-primary"
              onClick={() => claim(web3, accounts)}
              >
              Claim
              </Button>
              </>
            )
            :
            (
              <Alert variant="info">
              <p>Claimed, next claim will open</p>
              <hr/>
              <p>{fetchDate(Number(periodStart) + Number(claimPeriod))}</p>
              </Alert>
            )
          )
          :
          (
            <div align="center">
            <CircularProgress/>
            <br/>
            <small>
            <strong>
            Load claim data ...
            </strong>
            </small>
            </div>
          )
        }

        </>
      )
      :
      (
        <Alert variant="warning">Please connect wallet</Alert>
      )
    }
    </>
    </Form>
  )
}

export default inject('MobXStorage')(observer(Claim))
