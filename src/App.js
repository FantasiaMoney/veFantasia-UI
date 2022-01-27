import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import getWeb3 from './service/getWeb3'
import { HashRouter } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { NetworkID } from './config'
import Header from './components/static/Header'
import Routes from './components/static/Routes'
import Footer from './components/static/Footer'
import './App.css'

async function initWeb3(props, setWeb3, setNetId){
  // get web3 and account
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3()
    setWeb3(web3)
    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts()
    // Get network ID
    const netId = await web3.eth.net.getId()
    // set state
    setNetId(netId)
    // set web3 and accounts to the global state
    props.MobXStorage.initWeb3AndAccounts(web3, accounts)
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      console.error("errror", error)
  }
  // relaod app if accout was changed
  if(window.ethereum)
  window.ethereum.on('accountsChanged', () => window.location.reload())
}



function App(props) {
  const [netId, setNetId] = useState(null)
  const [web3, setWeb3] = useState(null)

  useEffect(
    () => { initWeb3(props, setWeb3, setNetId) },
    [props] // empty array ensures effect on run on mount and unmount
  )

  return (
    <HashRouter>
    {
      /*
      <Header />
      */
    }

    {
      web3 && netId !== NetworkID
      ?
      (
        <Alert variant="danger"> Wrong network </Alert>
      )
      : null
    }
    <br/>
    <Routes props={props}/>
    <Footer />
    </HashRouter>
  )
}

export default inject('MobXStorage')(observer(App))
