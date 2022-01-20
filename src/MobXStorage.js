import { observable, action, decorate } from 'mobx'

class MOBXStorage {
  web3 = null
  accounts = null

  initWeb3AndAccounts = (_web3, accounts) => {
    this.web3 = _web3
    this.accounts = accounts
  }
}

decorate(MOBXStorage, {
   web3: observable,
   accounts: observable,
   initWeb3AndAccounts:action,
})

const MobXStorage = new MOBXStorage()

export default MobXStorage
