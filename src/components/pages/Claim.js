import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Card, Form, Alert, Button } from 'react-bootstrap'
import FetchAbi from '../../abi/FetchAbi'
import VTokenToTokenABI from '../../abi/VTokenToTokenABI'
import VTokenToTokenViewHelperABI from '../../abi/VTokenToTokenViewHelperABI'
import VTokenAddressABI from '../../abi/VTokenAddressABI'
import { inject, observer } from 'mobx-react'
import { fromWei } from 'web3-utils'

import {
  FetchAddress,
  VTokenAddress,
  VTokenToToken,
  VTokenToTokenViewHelper,
  CONVERT_DURATION
} from '../../config'


// helper for convert unix time to date
function fetchDate(unixDate){
  const date = new Date(unixDate * 1000)
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

// helper for load data from contracts
async function getData(web3, accounts){
  let myDeposits = []
  let totalUserDeposits = 0

  if(web3){
    try{

    }
    catch(e){
      console.log("err", e)
    }
  }

  return myDeposits
}


function Claim(props) {
  const [myDeposits, setMyDeposits] = useState([])
  const [noDeposits, setNoDeposits] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
         // get data
         const _myDeposits  = await getData(web3, accounts)

         // set states
         if(!isCancelled && web3){
           setMyDeposits(_myDeposits)

           console.log("_myDeposits", _myDeposits)

           if(_myDeposits.length === 0)
             setNoDeposits(true)
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
          myDeposits.length > 0
          ?
          (
            <>
            {
              myDeposits.map((item, key) => {
                // const returnA = await calculateReturn(web3, item.time, calculateDeposit(item.balanceBefore, item.balanceAfter))
                return (
                  <div key={key}>
                  <Card >
                  <Card.Header>
                  Deposit time {item.depositDate}
                  </Card.Header>
                  <Card.Body>
                  Deposited : { item.deposited } vDAO
                  <hr/>
                  Current rate : { item.deposited } = { item.reedemAmount } DAO
                  <hr/>
                  Current loss { Number(100 - 100 / item.deposited * item.reedemAmount).toFixed(2) } %
                  <hr/>
                  Exit with 1 to 1 rate will be available : {item.withdrawDate}
                  <hr/>
                  </Card.Body>
                  </Card>
                  <br/>
                  </div>
                )
              })
            }
            </>
          )
          :
          (
            <div align="center">
            <CircularProgress/>
            <br/>
            <small>
            <strong>
            Load data ...
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
