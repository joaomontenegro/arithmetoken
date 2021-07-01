import React, { Component } from 'react'


class MintOpToken extends Component {

    constructor(props) {
        super(props)
        this.state = {
            opToMint : "+"
        }

        this.contracts = props.contracts

        this.onSetOp = this.onSetOp.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
      }

    onSetOp(event) {
        this.setState({opToMint : event.target.value})
    }

    onSubmit(event) {
        event.preventDefault()
        console.log("---->", this.state.opToMint)
        this.contracts.mintOpToken(this.state.opToMint)
    }

    render() {
        return (
            <form className="App-form" onSubmit={this.onSubmit}>
                <select onChange={this.onSetOp} required>
                  <option key="0" value="+"> &nbsp;+&nbsp; </option>
                  <option key="1" value="-"> &nbsp;-&nbsp; </option>
                  <option key="2" value="*"> &nbsp;*&nbsp; </option>
                  <option key="3" value="/"> &nbsp;/&nbsp; </option>
                </select>
                &nbsp;
                <button type="submit">&gt; MINT Op Token &lt;</button>
            </form>
        );
    }
   
}

export default MintOpToken;
