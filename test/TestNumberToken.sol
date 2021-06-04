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

    function testGetTokensInAddress() public {
        Token numToken = new Token();
        uint256 tokenId11 = numToken.mintNumber(tx.origin, "http://11.json", 11);
        uint256 tokenId22 = numToken.mintNumber(tx.origin, "http://22.json", 22);
        uint256 tokenId33 = numToken.mintNumber(tx.origin, "http://33.json", 33);
        uint256 tokenId44 = numToken.mintNumber(tx.origin, "http://44.json", 44);

        Assert.equal(numToken.balanceOf(tx.origin), 4, "Balance of owner should have 4 Tokens.");

        uint256[] memory tokens = numToken.getTokensInAddress(tx.origin);
        Assert.equal(tokens.length, 4, "Tokens list of owner should have 4 Tokens.");
        Assert.equal(tokens[0], tokenId11, "Token 0 of owner should be 11.");
        Assert.equal(tokens[1], tokenId22, "Token 1 of owner should be 22.");
        Assert.equal(tokens[2], tokenId33, "Token 2 of owner should be 33.");
        Assert.equal(tokens[3], tokenId44, "Token 3 of owner should be 44.");

    }


}
