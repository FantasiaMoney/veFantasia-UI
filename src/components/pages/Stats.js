import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Card, Form } from 'react-bootstrap'
import Web3 from 'web3'
import OhmAbi from '../../abi/OhmAbi'
import DexRouterAbi from '../../abi/DexRouterAbi'
import TreasuryAbi from '../../abi/TreasuryAbi'

import {
  OhmAddress,
  Web3Rpc,
  DexRouterAddress,
  OneTokenInWei,
  StableCoinAddress,
  WethAddress,
  TreasuryAddress,
  TOKEN_SYMBOL,
  OHM_WETH_pair,
  USD_DECIMALS,
  TOKEN_DECIMALS
} from '../../config'



async function getData(){
  let _price = 0
  let _tokenSupply = 0
  let _ldInUSD = 0

  try{
    const web3 = new Web3(Web3Rpc)
    const token = new web3.eth.Contract(OhmAbi, OhmAddress)
    const wEth = new web3.eth.Contract(OhmAbi, WethAddress)
    const router = new web3.eth.Contract(DexRouterAbi, DexRouterAddress)
    const treasury = new web3.eth.Contract(TreasuryAbi, TreasuryAddress)
    const wEthLD = await wEth.methods.balanceOf(OHM_WETH_pair).call()

    const ratio = await router.methods.getAmountsOut(
      OneTokenInWei,
      [OhmAddress, WethAddress, StableCoinAddress]
    ).call()

    const ldUSD = await router.methods.getAmountsOut(
      wEthLD,
      [WethAddress, StableCoinAddress]
    ).call()

    _price = ratio[2]
    _tokenSupply = await token.methods.totalSupply().call()
    _ldInUSD = ldUSD[1]
  }
  catch(e){
    console.log("err", e)
  }

  return {
    _tokenSupply,
    _price,
    _ldInUSD
  }
}


function Stats(props) {
  const [tokenSupply, setTokenSupply] = useState(0)
  const [price, setPrice] = useState(0)
  const [ldInUSD, setLdInUSD] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
         // get data
         const {
           _tokenSupply,
           _price,
           _ldInUSD
         } = await getData()

         // set states
         if(!isCancelled){
           setTokenSupply(_tokenSupply)
           setPrice(_price)
           setLdInUSD(_ldInUSD)
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
        <Card>
        <Card.Header>
        Token supply: { Number(Number(tokenSupply) / (10**TOKEN_DECIMALS)).toFixed(2) } {TOKEN_SYMBOL}
        </Card.Header>

        <Card.Header>
        Price: 1 {TOKEN_SYMBOL} = {Number(Number(price / 10**USD_DECIMALS)).toFixed(2)} USD
        </Card.Header>

        <Card.Header>
        Market Cap: {Number(
          Number(Number(price / 10**USD_DECIMALS)) * Number(Number(tokenSupply) / (10**TOKEN_DECIMALS))
        ).toFixed(2)} USD
        </Card.Header>

        <Card.Header>
        TVL : {Number(
          Number(ldInUSD) / (10**USD_DECIMALS)
        ).toFixed(2)} USD
        </Card.Header>
        </Card>
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
