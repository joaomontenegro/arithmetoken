import AbstractTokenList from './AbstractTokenList';
import './App.css';

class Expression extends AbstractTokenList {

    constructor(props) {
        super(props);

        // Extend the parent's state
        this.state.expression = []

        this.onSelectToken = this.onSelectToken.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSelectToken(event) {
        let newExpression = this.state.expression;
        newExpression[event.target.id] = event.target.value;
        this.setState({expression : newExpression});
    }

    async onSubmit(event) {
        event.preventDefault();

        try {
            this.contracts.mintWithExpression(this.state.expression);
            this.setState({expression : []});
            
        } catch (e) {
            console.log(e);
            console.log("Invalid Expression!");
        }
    }

    render() {
        const tokens = this.getTokens();

        // Create the dropdown token options
        const options = [ <option key={-1} value=""></option> ];
        for (var i = 0; i < tokens.length; i++) {
            const token = tokens[i];
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
            <div className="App-form">
                <form onSubmit={this.onSubmit}>
                    <b>Minting Expression:</b>&nbsp;
                    {dropDowns}
                    &nbsp;
                    <button type="submit">Mint</button>
                </form>
            </div>
        );
    }


   
}

export default Expression;
