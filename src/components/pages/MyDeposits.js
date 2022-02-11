import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Card, Form, Alert } from 'react-bootstrap'
import Web3 from 'web3'
import FetchAbi from '../../abi/FetchAbi'
import { inject, observer } from 'mobx-react'

import {
  FetchAddress
} from '../../config'



async function getData(web3, accounts){
  let myDeposits = []
  let totalUserDeposits = 0

  if(web3){
    try{
      const fetchContract = new web3.eth.Contract(FetchAbi, FetchAddress)
      totalUserDeposits = await fetchContract.methods.totalUserDeposits(accounts[0]).call()

      if(totalUserDeposits > 0){
        for(let i = 0; i < totalUserDeposits; i++){
          myDeposits.push(
            await fetchContract.methods.depositsPerUser(accounts[0], i).call()
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
  return {
    myDeposits
  }
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
         const { _myDeposits } = await getData(web3, accounts)

         // set states
         if(!isCancelled){
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
            {myDeposits}
            {
              // myDeposits.length > 0
              // ?
              // (
              //   <>
              //   {
              //     myDeposits.map((key, item) => {
              //       return (
              //         <Card key={key}>
              //         <Card.Header>
              //         Test
              //         </Card.Header>
              //         </Card>
              //       )
              //     })
              //   }
              //   </>
              // )
              // :
              // (
              //   <>No deposits </>
              // )
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
