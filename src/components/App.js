import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css';
import { render } from 'react-dom';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      balance: 0
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  render() {
    let content
    content = <p>Balance: { this.state.balance } eth </p>

    return (
      <div className="App">
        <header>
          ArithmeToken
        </header>

        { content }
        
      </div>
    );
  }

  async loadBlockchainData() {
    const web3 = window.web3
    
    const networkId = await web3.eth.net.getId()
    
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    this.setState({ account: account })

    const balance = web3.utils.fromWei(await web3.eth.getBalance(account))
    this.setState({ balance: balance })
  }

}

export default App;
