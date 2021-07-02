import AbstractTokenList from './AbstractTokenList';
import TokenInfo from './TokenInfo';

class TokenList extends AbstractTokenList {
    render() {
        const tokens = this.getTokens();
        const tokenRows = [];
        for (var i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            tokenRows.push(
                <tr key={i}>
                    <td>
                        <TokenInfo token={token}/>
                    </td>
                </tr>
            );
        }

        return (
            <div id="TokenList" className="App-list">
                <h1>My Tokens</h1>
                <table border="1" className="App-table">
                    <tbody>
                        {tokenRows}
                    </tbody>
                </table>
            </div>
        );
    }
  
}

export default TokenList;
