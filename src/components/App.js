import React, { Component } from 'react'
import Contracts from './Contracts'
import TokenList from './TokenList';
import MintNumberToken from './MintNumberToken';
import MintOpToken from './MintOpToken';
import Expression from './Expression';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          tokenBalance : 0,
          tokensInAccount : [],
        };
        
        this.contracts = new Contracts();
        
        this.mintedEventHandler = this.mintedEventHandler.bind(this);
    }

    async componentDidMount() {
        // Load Web3 and the smart contracts
        await this.contracts.initWeb3();
        await this.contracts.load(this.mintedEventHandler);
        
        // Update the list of tokens in the account
        this.setState({ tokensInAccount: await this.contracts.getTokens() });
    }
  
    render() {
      return (
        <div className="App">
            <header className="App-header">
              ArithmeToken
            </header>

            <TokenList
                account={this.contracts.account}
                tokensInAccount={this.state.tokensInAccount}
            />

            <hr></hr>
            <Expression 
                contracts={this.contracts}
                tokensInAccount={this.state.tokensInAccount}
            />

            <hr></hr>
            <b> Cheating </b>
            <MintOpToken
                contracts={this.contracts}
            />

            <br></br>
            <MintNumberToken
                contracts={this.contracts}
            />
        </div>
      );
    }

    async mintedEventHandler (error, event) {
        if (error) {
            window.alert("error while subscribing to event");
        } else {
            await this.setState({ tokensInAccount: await this.contracts.getTokens() });
        }
    }

}

export default App;
