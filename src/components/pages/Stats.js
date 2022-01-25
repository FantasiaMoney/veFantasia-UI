import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
// import { inject, observer } from 'mobx-react'
import { Card, Form } from 'react-bootstrap'
import Web3 from 'web3'
import OhmAbi from '../../abi/OhmAbi'
import { OhmAddress, Web3Rpc } from '../../config'

async function getData(){
  const web3 = new Web3(Web3Rpc)
  const token = new web3.eth.Contract(OhmAbi, OhmAddress)
  const _tokenSupply = await token.methods.totalSupply().call()

  return {
    _tokenSupply
  }
}


function Stats(props) {
  const [tokenSupply, setTokenSupply] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
         // get data
         const {
           _tokenSupply
         } = await getData()

         // set states
         if(!isCancelled){
           setTokenSupply(_tokenSupply)
           setDataLoaded(true)
         }
     }
     loadData()
     return () => {
     isCancelled = true
   }
  }, [])

  return (
    <Form>
    {
      dataLoaded
      ?
      (
        <>
        <Card body>
        Token supply: { Number(tokenSupply) / (10**9) }
        </Card>
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

export default Stats
