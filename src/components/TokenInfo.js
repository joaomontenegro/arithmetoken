import React, { Component } from 'react'

class TokenInfo extends Component {

    constructor(props) {
        super(props);

        this.token = props.token;
    }

    render() {
        return (
            <table className="App-table">
                <tbody>
                    <tr key={this.token.id}>
                        <td>{this.token.type}</td>
                        <td><img src={this.token.image} alt={this.token.value}/></td>
                        <td>{this.token.value}</td>
                        <td><a href={this.token.uri}>json</a></td>
                    </tr>
                </tbody>
            </table>
        );
    
    }
}

export default TokenInfo;
