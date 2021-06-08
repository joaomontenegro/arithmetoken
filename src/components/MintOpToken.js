import React, { Component } from 'react'


class MintOpToken extends Component {

    constructor(props) {
        super(props)
        this.state = {
            opToMint : 0
        }

        this.contracts = props.contracts

        this.onSetOp = this.onSetOp.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
      }

    onSetOp(event) {
        this.setState({opToMint : parseInt(event.target.value)})
    }

    onSubmit(event) {
        event.preventDefault()
        const op = this.state.opToMint
        this.contracts.mintOpToken(op)
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
