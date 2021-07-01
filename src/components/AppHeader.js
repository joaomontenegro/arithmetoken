import React, { Component } from 'react'


class AppHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <header className="App-header">
                <table className="App-header-table">
                    <tbody>
                        <tr>
                            <td className="App-header-title">
                                ArithmeToken
                            </td>
                            <td className="App-header-links">
                                Help | About
                            </td>
                        </tr>
                    </tbody>
                </table>
            </header>
        );
    }
   
}

export default AppHeader;
