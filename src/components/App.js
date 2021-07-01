import React, { Component } from 'react'
import AppHeader from './AppHeader'
import Contracts from './Contracts'
import ExpressionForm from './ExpressionForm';
import MintNumberToken from './MintNumberToken';
import MintOpToken from './MintOpToken';
import TokenList from './TokenList';

import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          isConnected: false
        };

        this.onConnectWallet = this.onConnectWallet.bind(this);
        this.contracts = new Contracts();
    }

    async onConnectWallet(event) {
        event.preventDefault();

        // Load Web3 and the smart contracts
        await this.contracts.initWeb3();
        await this.contracts.load();
        
        this.setState({ isConnected: true });
    }
  
    render() {
        if (this.state.isConnected) {
            return (
                <div>
                    <AppHeader/>
                    <TokenList contracts={this.contracts}/>
                    <hr/>
                    <ExpressionForm contracts={this.contracts}/>
                    <hr></hr>
                    <MintOpToken contracts={this.contracts}/>
                    <br/>
                    <MintNumberToken contracts={this.contracts}/>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <AppHeader/>
                    <br/>
                    <p className="App-big-text">Own the Integers!</p>
                    <br/>
                    <form onSubmit={this.onConnectWallet}>
                        <button className="App-button">
                            Connect Wallet
                        </button>
                    </form>
                </div>
            );
        }
    }

}

export default App;
