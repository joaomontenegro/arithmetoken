import React, { Component } from 'react'


class MintNumberToken extends Component {

    constructor(props) {
        super(props)
        this.state = {
          numberToMint : 0
        }

        this.onSetNumber = this.onSetNumber.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
      }

    onSetNumber(event) {
        this.setState({numberToMint : event.target.value})
    }

    onSubmit(event) {
        event.preventDefault()

        const number = this.state.numberToMint

        const uri = "http://" + number + ".json"
        this.props.tokenContract.methods.mintNumber(this.props.account, uri, number)
          .send({ from: this.props.account })
            .on('transactionHash', (hash) => { 
              console.log("Minted: " + number)
            })
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <input type="text" size="4" value={this.state.numberToMint}  onChange={this.onSetNumber} placeholder="0" required/>
                &nbsp;
                <button type="submit">&gt; MINT Number Token &lt;</button>
            </form>
        );
    }
   
}

export default MintNumberToken;
