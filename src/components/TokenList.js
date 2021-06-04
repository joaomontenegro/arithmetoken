import React, { Component } from 'react'


class TokenList extends Component {
    render() {
        const tokenRows = []
        for (var i = 0; i < this.props.tokensInAccount.length; i++) {
            const token = this.props.tokensInAccount[i]
            tokenRows.push(
                <tr key={i}>
                    <td>{token.id}</td>
                    <td>{token.type}</td>
                    <td>{token.value}</td>
                    <td>{token.uri}</td>
                </tr>)
        }

        return (
            <div id="TokenList">
                <p><b>Tokens of</b> {this.props.account}:</p>
                <table align="center" border="1">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Type</th>
                            <th scope="col">Value</th>
                            <th scope="col">URI</th>
                        </tr>

                        {tokenRows}

                    </thead>
                </table>
            </div>
        );
    }

   
}

export default TokenList;
