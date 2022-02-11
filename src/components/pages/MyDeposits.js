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

// helper for convert token to v token
function withdraw(web3, accounts, _depositId, _amount){
  const converter = new web3.eth.Contract(VTokenToTokenABI, VTokenToToken)
  converter.methods.convert(accounts[0], _depositId, _amount)
  .send({ from:accounts[0] })
}

// helper for approve to burn
function unlock(web3, accounts, _amount){
  const token = new web3.eth.Contract(VTokenAddressABI, VTokenAddress)
  token.methods.approveBurn(VTokenToToken, _amount)
  .send({ from:accounts[0] })
}

// helper for load data from contracts
async function getData(web3, accounts){
  let myDeposits = []
  let totalUserDeposits = 0

  if(web3){
    try{
      const fetchContract = new web3.eth.Contract(FetchAbi, FetchAddress)
      const converter = new web3.eth.Contract(VTokenToTokenABI, VTokenToToken)
      totalUserDeposits = await fetchContract.methods.totalUserDeposits(accounts[0]).call()

      if(totalUserDeposits > 0){
        const viewHelper = new web3.eth.Contract(VTokenToTokenViewHelperABI, VTokenToTokenViewHelper)
        for(let i = 0; i < totalUserDeposits; i++){
          // fetch data 
          const data = await fetchContract.methods.depositsPerUser(accounts[0], i).call()
          const depositedWei = await viewHelper.methods
          .calculateDeposit(data.balanceBefore, data.balanceAfter).call()

          const deposited = Number(fromWei(depositedWei)).toFixed(6)
          const depositDate = await fetchDate(data.time)
          const withdrawDate = await fetchDate(Number(data.time) + CONVERT_DURATION)
          const depositId = i

          const reedemInWei = await viewHelper.methods.calculateReturn(
             CONVERT_DURATION,
             data.time,
             data.balanceBefore,
             data.balanceAfter
          ).call()

          const reedemAmount = reedemInWei > 0
          ? Number(fromWei(String(reedemInWei))).toFixed(8)
          : 0

          // check if deposit converted
          const used = await converter.methods.timeUsed(
            accounts[0],
            data.time
          ).call()

          // push only not converted deposits
          if(!used)
          myDeposits.push(
            { ...data,
              deposited,
              depositDate,
              reedemAmount,
              withdrawDate,
              depositedWei,
              depositId
            }
          )
        }
      }
    }
    catch(e){
      console.log("err", e)
    }
  }

  return myDeposits
}


function MyDeposits(props) {
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
    {
      noDeposits
      ?
      (
        <Alert variant="warning">Can not find any deposit for address {accounts[0]}</Alert>
      )
      :
      null
    }
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

                  <Button
                  variant="outline-warning"
                  onClick={() => unlock(
                    web3,
                    accounts,
                    item.depositedWei
                  )}
                  >
                  Unlock
                  </Button>

                  <Button
                  variant="outline-primary"
                  onClick={() => withdraw(
                    web3,
                    accounts,
                    item.depositId,
                    item.depositedWei
                  )}
                  >
                  Exit
                  </Button>
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

export default inject('MobXStorage')(observer(MyDeposits))
