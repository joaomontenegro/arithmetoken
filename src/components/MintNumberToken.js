import React, { Component } from 'react'

class MintNumberToken extends Component {

    constructor(props) {
        super(props);
        this.state = {
          numberToMint : 0
        };

        this.contracts = props.contracts;

        this.onSetNumber = this.onSetNumber.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
      }

    onSetNumber(event) {
        this.setState({numberToMint : event.target.value});
    }

    async onSubmit(event) {
        event.preventDefault();
        const number = this.state.numberToMint;
        this.contracts.mintNumberToken(number)
    }

    render() {
        return (
            <form className="App-form" onSubmit={this.onSubmit}>
                <input type="text" size="4" value={this.state.numberToMint}  onChange={this.onSetNumber} placeholder="0" required/>
                &nbsp;
                <button type="submit">&gt; MINT Number Token &lt;</button>
            </form>
        );
    }
   
}

export default MintNumberToken;
