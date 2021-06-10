// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Token.sol";

contract TestTokens {
    function testInitialBalanceUsingDeployedContract() public {
        Token numToken = Token(DeployedAddresses.Token());

        Assert.equal(numToken.balanceOf(tx.origin), 0, "Owner should have 0 Token initially");
    }

    function testInitialBalanceWithNewNumberToken() public {
        Token numToken = new Token();

        Assert.equal(numToken.balanceOf(tx.origin), 0, "Owner should have 0 Token initially");
    }
}
