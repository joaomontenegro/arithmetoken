import React, { Component } from 'react'
import Web3 from 'web3'
import Token from '../abis/Token.json'
import MathContract from '../abis/MathContract.json'
import TokenList from './TokenList';
import MintNumberToken from './MintNumberToken';
import MintOpToken from './MintOpToken';
import Expression from './Expression';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      account: '0x0',
      ethBalance: 0,
      tokenContract : {},
      tokenBalance : 0,
      tokensInAccount : [],
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
    return (
      <div className="App">
        <header className="App-header">
          ArithmeToken
        </header>

        <TokenList
            account={this.state.account}
            tokensInAccount={this.state.tokensInAccount}
        />

        <hr></hr>

        <Expression 
          account={this.state.account}
          tokenContract={this.state.tokenContract}
          mathContract={this.state.mathContract}
          tokensInAccount={this.state.tokensInAccount}
        />

        <hr></hr>
        
        <b> Cheating </b>

        <MintOpToken
          account={this.state.account}
          tokenContract={this.state.tokenContract}
        />

        <br></br>

        <MintNumberToken
          account={this.state.account}
          tokenContract={this.state.tokenContract}
        />

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

    // Eth balance
    const ethBalance = web3.utils.fromWei(await web3.eth.getBalance(account))
    this.setState({ ethBalance: ethBalance })

    // Load the Token contract
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const tokenContract = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ tokenContract })
      
      let tokenBalance = await tokenContract.methods.balanceOf(account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })

      // Get the tokens in the account
      const tokensInAccount = []
      let tokenIds = await tokenContract.methods.getTokensInAddress(account).call()
      for (const tokenId of tokenIds) {
        const token = await this.getToken(tokenId)
        tokensInAccount.push(token)
      }

      this.setState({ tokensInAccount: tokensInAccount })


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

  async getToken(tokenId) {
    let value
    let tokenType = parseInt(await this.state.tokenContract.methods.getType(tokenId).call())

    if (tokenType === 0) {
      tokenType = "Op"
      const op = parseInt(await this.state.tokenContract.methods.getOperation(tokenId).call())
            
      if (op === 0) { value = "+"; }
      else if (op === 1) { value = "-"; }
      else if (op === 2) { value = "*"; }
      else if (op === 3) { value = "/"; }
      
    } else {
      tokenType = "Num"
      value = await this.state.tokenContract.methods.getNumber(tokenId).call()
    }

    const uri = await this.state.tokenContract.methods.tokenURI(tokenId).call()
    
    const token = {
      id:    tokenId,
      type:  tokenType,
      value: value,
      uri:   uri 
    }

    return token
  }


}


export default App;
