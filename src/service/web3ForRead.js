import Web3 from "web3"

const provider = new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA)
const web3ForRead = new Web3(provider)

export default web3ForRead
