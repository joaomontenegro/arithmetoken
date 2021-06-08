import React, { Component } from 'react'


class Expression extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expression : []
        };

        this.contracts = props.contracts;

        this.onSelectToken = this.onSelectToken.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSelectToken(event) {
        let newExpression = this.state.expression;
        newExpression[event.target.id] = event.target.value;
        this.setState({expression : newExpression});

        console.log(this.state.expression);
    }

    async onSubmit(event) {
        event.preventDefault();

        try {
            //TODO calculate and mint at once
            const number = await this.contracts.mathContract.methods.calculate(this.state.expression).call();
            this.contracts.mintNumberToken(number)

        } catch (e) {
            console.log("Invalid Expression!");
        }
        
    }

    render() {
        // Create the dropdown token options
        const options = [ <option key={-1} value=""></option> ];
        for (var i = 0; i < this.props.tokensInAccount.length; i++) {
            const token = this.props.tokensInAccount[i];
            options.push(
                <option key={i} value={token.id}>{token.value}</option>
            );
        }
        
        // Create the dropdowns - one per token in the expression 
        const dropDowns = [];
        for (var j = 0; j < this.state.expression.length + 1; j++) {
            dropDowns.push(
                <select key={j} id={j} onChange={this.onSelectToken}>
                    {options}
                </select>
            );
        }

        return (
            <form onSubmit={this.onSubmit}>
                <b>Minting Expression:</b>&nbsp;
                {dropDowns}
                &nbsp;
                <button type="submit">Mint</button>
            </form>
        );
    }


   
}

export default Expression;
