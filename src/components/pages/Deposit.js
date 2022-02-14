import React, { useState, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import {
  CURRENCY,
  FetchAddress,
  TOKEN_SYMBOL,
  DexRouterAddress,
  WethAddress,
  TokenAddress
} from '../../config'
import FetchAbi from '../../abi/FetchAbi'
import DexRouterAbi from '../../abi/DexRouterAbi'
import { toWei, fromWei } from 'web3-utils'


async function depositToFetch(amount, web3, accounts){
  if(Number(amount) <= 0)
    return alert("Wrong amount")

  const fetchContract = new web3.eth.Contract(FetchAbi, FetchAddress)
  fetchContract.methods.convert()
  .send({
    from:accounts[0],
    value:web3.utils.toWei(String(amount))
  })
}

async function getPrice(web3, amount){
  const router = new web3.eth.Contract(DexRouterAbi, DexRouterAddress)
  const ratio = await router.methods.getAmountsOut(
    toWei(String(amount)),
    [WethAddress, TokenAddress]
  ).call()
 return fromWei(ratio[1])
}

function Deposit(props) {
  const [amount, setAmount] = useState(0)
  const [price, setPrice] = useState(0)
  const web3 = props.MobXStorage.web3
  const accounts = props.MobXStorage.accounts

  useEffect(() => {
    let isCancelled = false
     async function loadData() {
       // set states
       if(!isCancelled && web3 && amount > 0){
         const price = await getPrice(web3, amount)
         setPrice(price)
       }
     }
     loadData()
     return () => {
     isCancelled = true
   }
  }, [web3, amount])

  return(
    <Form>
    {
      web3
      ?
      (
        <>
        <Form.Group>
        <Form.Label>Input { CURRENCY } amount</Form.Label>
        <Form.Control
         type="number"
         min="0"
         value={amount}
         onChange={(e) => setAmount(e.target.value)}
        />
        </Form.Group>

        <Form.Group>
        <Button
         variant="outline-primary"
         onClick={() => depositToFetch(amount, web3, accounts)}>
        Deposit
        </Button>
        <br/>
        <br/>
        {
          price > 0
          ?
          (
            <Alert variant="success">You will recieve: {price} v{TOKEN_SYMBOL}</Alert>
          )
          : null
        }
        </Form.Group>
        </>
      )
      :
      (
        <Alert variant="warning">Please connect wallet</Alert>
      )
    }
    </Form>
  )
}

export default inject('MobXStorage')(observer(Deposit))
