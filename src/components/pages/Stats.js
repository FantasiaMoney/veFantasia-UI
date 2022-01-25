import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
// import { inject, observer } from 'mobx-react'
import { Card, Form } from 'react-bootstrap'
import Web3 from 'web3'
import OhmAbi from '../../abi/OhmAbi'
import DexRouterAbi from '../../abi/DexRouterAbi'
import {
  OhmAddress,
  Web3Rpc,
  DexRouterAddress,
  OneTokenInWei,
  StableCoinAddress,
  WethAddress
} from '../../config'
import { fromWei } from 'web3-utils'


async function getData(){
  let _price = 0
  let _tokenSupply = 0

  try{
    const web3 = new Web3(Web3Rpc)
    const token = new web3.eth.Contract(OhmAbi, OhmAddress)
    const router = new web3.eth.Contract(DexRouterAbi, DexRouterAddress)
    const ratio = await router.methods.getAmountsOut(
      OneTokenInWei,
      [OhmAddress, WethAddress, StableCoinAddress]
    ).call()
    console.log(ratio[2], ratio)
    _price = ratio[2]
    _tokenSupply = await token.methods.totalSupply().call()
  }catch(e){
    console.log("err", e)
  }

  return {
    _tokenSupply,
    _price
  }
}


function Stats(props) {
  const [tokenSupply, setTokenSupply] = useState(0)
  const [price, setPrice] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
         // get data
         const {
           _tokenSupply,
           _price
         } = await getData()

         // set states
         if(!isCancelled){
           setTokenSupply(_tokenSupply, _price)
           setPrice(_price)
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
        Token supply: { Number(Number(tokenSupply) / (10**9)).toFixed(2) }
        </Card>
        <br/>
        <Card body>
        Price: 1 token = {Number(fromWei(price)).toFixed(2)} USD
        </Card>
        <br/>
        <Card body>
        Market Cap: {Number(
          Number(fromWei(price)) * Number(Number(tokenSupply) / (10**9))
        ).toFixed(2)} USD
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
