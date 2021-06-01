import React, { Component } from 'react'
import Web3 from 'web3'
import Token from '../abis/Token.json'
import MathContract from '../abis/MathContract.json'
import './App.css';
import logo from './logo512.png';
import { render } from 'react-dom';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      account: '0x0',
      balance: 0,
      tokenContract : {},
      tokenBalance : 0,
      mathContract : {}
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

    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <div>
          <p>ETH Balance: <b>{ this.state.balance }</b> eth </p>
          <p> ArithmeToken Balance: <b>{ this.state.tokenBalance }</b> </p>
        </div>
    }

    return (
      <div className="App">
        <header className="App-header">
          ArithmeToken
        </header>

        { content }

        <form onSubmit={(event) => {
                console.log("MINTING!")
                event.preventDefault()
                this.mintNumber("http://123.json", 123)
              }}>
        <button type="submit">MINT!</button>
        </form>
        
      </div>
    );
  }

  async loadBlockchainData() {
    const web3 = window.web3
    
    const networkId = await web3.eth.net.getId()
    
    // Get the current account
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    this.setState({ account: account })

    // TODO eth balance
    const balance = web3.utils.fromWei(await web3.eth.getBalance(account))
    this.setState({ balance: balance })

    // Load the Token contract
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const tokenContract = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ tokenContract })
      let tokenBalance = await tokenContract.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load the Math contract
    const mathData = MathContract.networks[networkId]
    if(mathData) {
      const mathContract = new web3.eth.Contract(MathContract.abi, mathData.address)
      this.setState({ mathContract })
    } else {
      window.alert('MathContract contract not deployed to detected network.')
    }
  }

  mintNumber = (uri, number) => {
    this.setState({ loading: true })
    this.state.tokenContract.methods.mintNumber(this.state.account, uri, number)
      .send({ from: this.state.account })
        .on('transactionHash', (hash) => { 
          this.setState({ loading: false })
        })
  }

}

export default App;
