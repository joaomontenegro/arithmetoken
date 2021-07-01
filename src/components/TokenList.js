import AbstractTokenList from './AbstractTokenList';

class TokenList extends AbstractTokenList {
    render() {
        const tokens = this.getTokens();
        const tokenRows = [];
        for (var i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            tokenRows.push(
                <tr key={i}>
                    <td>{token.id}</td>
                    <td>{token.type}</td>
                    <td>{token.value}</td>
                    <td><a href={token.uri}>{token.uri}</a></td>
                    <td><img src={token.image} alt={token.value}/></td>
                </tr>);
        }

        return (
            <div id="TokenList" className="App-list">
                <h1>My Tokens</h1>
                <table border="1" className="App-table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Type</th>
                            <th scope="col">Value</th>
                            <th scope="col">URI</th>
                            <th scope="col">Image</th>
                        </tr>

                        {tokenRows}

                    </thead>
                </table>
            </div>
        );
    }
  
}

export default TokenList;
