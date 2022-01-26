import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
// import { inject, observer } from 'mobx-react'
import { Card, Form } from 'react-bootstrap'
import Web3 from 'web3'
import OhmAbi from '../../abi/OhmAbi'
import DexRouterAbi from '../../abi/DexRouterAbi'
import TreasuryAbi from '../../abi/TreasuryAbi'
import { fromWei } from 'web3-utils'

import {
  OhmAddress,
  Web3Rpc,
  DexRouterAddress,
  OneTokenInWei,
  StableCoinAddress,
  WethAddress,
  TreasuryAddress
} from '../../config'



async function getData(){
  let _price = 0
  let _tokenSupply = 0
  let _totalReserves = 0

  try{
    const web3 = new Web3(Web3Rpc)
    const token = new web3.eth.Contract(OhmAbi, OhmAddress)
    const router = new web3.eth.Contract(DexRouterAbi, DexRouterAddress)
    const treasury = new web3.eth.Contract(TreasuryAbi, TreasuryAddress)
    const ratio = await router.methods.getAmountsOut(
      OneTokenInWei,
      [OhmAddress, WethAddress, StableCoinAddress]
    ).call()

    _price = ratio[2]
    _tokenSupply = await token.methods.totalSupply().call()
    _totalReserves = await treasury.methods.totalReserves().call()
  }
  catch(e){
    console.log("err", e)
  }

  return {
    _tokenSupply,
    _price,
    _totalReserves
  }
}


function Stats(props) {
  const [tokenSupply, setTokenSupply] = useState(0)
  const [price, setPrice] = useState(0)
  const [totalReserves, setTotalReserves] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
         // get data
         const {
           _tokenSupply,
           _price,
           _totalReserves
         } = await getData()

         // set states
         if(!isCancelled){
           setTokenSupply(_tokenSupply, _price)
           setPrice(_price)
           setTotalReserves(_totalReserves)
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
        <br/>
        <Card body>
        Treasury : {Number(
          Number(totalReserves) / (10**9)
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
