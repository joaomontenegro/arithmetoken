import { Component } from 'react'

class AbstractTokenList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokensInAccount : []
        };

        this.contracts = props.contracts;
        this.mintedEventHandler = this.mintedEventHandler.bind(this);
    }

    async componentDidMount() {
        this.contracts.registerMintedEventHandler(this.mintedEventHandler);
        this.updateTokensInAccount();
    }

    async mintedEventHandler (error, event) {
        if (error) {
            window.alert("error while subscribing to event");
        } else {
            this.updateTokensInAccount();
        }
    }

    async updateTokensInAccount() {
        const tokens = await this.contracts.getTokens()
        await this.setState({ tokensInAccount: tokens });
    }

    getTokens() {
        return this.state.tokensInAccount;
    }
 
}

export default AbstractTokenList;
