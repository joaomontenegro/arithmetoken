import React, { Component } from 'react'


class MintOpToken extends Component {

    constructor(props) {
        super(props)
        this.state = {
          opToMint : 0
        }

        this.onSetOp = this.onSetOp.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
      }

    onSetOp(event) {
        this.setState({opToMint : event.target.value})
    }

    onSubmit(event) {
        event.preventDefault()

        const op = this.state.opToMint

        const uri = "http://" + op + ".json"
        this.props.tokenContract.methods.mintOperation(this.props.account, uri, op)
          .send({ from: this.props.account })
            .on('transactionHash', (hash) => { 
              console.log("Minted: " + op)
            })
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <select onChange={this.onSetOp} required>
                  <option key="0" value="0"> &nbsp;+&nbsp; </option>
                  <option key="1" value="1"> &nbsp;-&nbsp; </option>
                  <option key="2" value="2"> &nbsp;*&nbsp; </option>
                  <option key="3" value="3"> &nbsp;/&nbsp; </option>
                </select>
                &nbsp;
                <button type="submit">&gt; MINT Op Token &lt;</button>
            </form>
        );
    }
   
}

export default MintOpToken;
