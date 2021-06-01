// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Token.sol";

contract TestNumberToken {

    function testInitialBalanceUsingDeployedContract() public {
        Token numToken = Token(DeployedAddresses.Token());

        Assert.equal(numToken.balanceOf(tx.origin), 0, "Owner should have 0 Token initially");
    }

    function testInitialBalanceWithNewNumberToken() public {
        Token numToken = new Token();

        Assert.equal(numToken.balanceOf(tx.origin), 0, "Owner should have 0 Token initially");
    }

    function testMint() public {
        Token numToken = new Token();
        int64 number = 123;
        uint256 tokenId = numToken.mintNumber(tx.origin, "http://123.json", number);

        Assert.equal(numToken.balanceOf(tx.origin), 1, "Owner should have 1 Token after calling mint()");
        Assert.equal(numToken.getNumber(tokenId), number, "Expected number should be 123.");
    }


}
