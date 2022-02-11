import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Card, Form, Alert, Button } from 'react-bootstrap'
import Web3 from 'web3'
import FetchAbi from '../../abi/FetchAbi'
import VTokenToTokenABI from '../../abi/VTokenToTokenABI'
import { inject, observer } from 'mobx-react'
import { fromWei, toWei } from 'web3-utils'

import {
  FetchAddress,
  VTokenToToken
} from '../../config'

// helper for calculate deposit amount
function calculateDeposit(before, after){
  const balanceBefore = before > 0 ? fromWei(String(before)) : 0
  const balanceAfter = after > 0 ? fromWei(String(after)) : 0

  const result = balanceBefore > balanceAfter
  ? balanceBefore - balanceAfter
  : balanceAfter - balanceBefore

  return Number(result).toFixed(6)
}

// helper for convert unix time to date
function fetchDate(unixDate){
  const date = new Date(unixDate * 1000)
  return date.toLocaleDateString("en-US")
}

// helper for calculate how much user can reedem now
async function calculateReturn(web3, startTime, amount){
   const vTokenToToken = new web3.eth.Contract(VTokenToTokenABI, VTokenToToken)
   const toReedem = await vTokenToToken.methods
   .calculateReturn(startTime, toWei(String(amount)))
   .call()

   return Number(fromWei(String(toReedem))).toFixed(6)
}

// helper for load data from contracts
async function getData(web3, accounts){
  let myDeposits = []
  let totalUserDeposits = 0

  if(web3){
    try{
      const fetchContract = new web3.eth.Contract(FetchAbi, FetchAddress)
      totalUserDeposits = await fetchContract.methods.totalUserDeposits(accounts[0]).call()

      if(totalUserDeposits > 0){
        for(let i = 0; i < totalUserDeposits; i++){
          const data = await fetchContract.methods.depositsPerUser(accounts[0], i).call()
          const deposited = await calculateDeposit(data.balanceBefore, data.balanceAfter)
          const depositDate = await fetchDate(data.time)
          const toReedem = await calculateReturn(web3, data.time, toWei(String(deposited)))
          const reedemAmount = toReedem > 0 ? Number(fromWei(String(toReedem))).toFixed(6): 0

          console.log("data.balanceBefore", deposited, depositDate, reedemAmount)

          myDeposits.push(
            { ...data, deposited, depositDate, reedemAmount }
          )
        }
      }
    }
    catch(e){
      console.log("err", e)
    }
  }

  console.log(myDeposits.length)
  console.log(myDeposits)

  return myDeposits

}


function MyDeposits(props) {
  const [myDeposits, setMyDeposits] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
         // get data
         const _myDeposits  = await getData(web3, accounts)

         // set states
         if(!isCancelled){
           console.log("Should update states", _myDeposits)
           setMyDeposits(_myDeposits)
           setDataLoaded(true)
         }
     }
     loadData()
     return () => {
     isCancelled = true
   }
  }, [web3, accounts])

  console.log("myDeposits", myDeposits, dataLoaded)

  return (
    <Form>
    {
      dataLoaded
      ?
      (
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
                      Amount : { item.deposited }
                      <br/>
                      To reedem : { item.reedemAmount }
                      <br/>
                      <Button variant="outline-primary">Reedem</Button>
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
                <>No deposits </>
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
    </Form>
  )
}

export default inject('MobXStorage')(observer(MyDeposits))
