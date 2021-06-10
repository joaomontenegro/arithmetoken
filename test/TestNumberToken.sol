// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../src/contracts/Token.sol";

contract TestNumberToken {
    function testMint() public {
        Token numToken = new Token();
        int64 number = 123;
        uint256 tokenId = numToken.mintNumber(tx.origin, "123.json", number);

        Assert.equal(numToken.balanceOf(tx.origin), 1, "Owner should have 1 Token after calling mint()");
        Assert.equal(numToken.getNumber(tokenId), number, "Expected number should be 123.");
    }

    function testGetTokenInfos() public {
        Token numToken = new Token();
        numToken.mintNumber(tx.origin, "11.json", 11);
        numToken.mintNumber(tx.origin, "22.json", 22);

        Assert.equal(numToken.balanceOf(tx.origin), 2, "Balance should have 2 Tokens.");

        Token.TokenInfo[] memory tokensInfos = numToken.getTokenInfos(tx.origin);
        Assert.equal(tokensInfos.length, 2, "Tokens list should have 2 Tokens.");

        Token.TokenInfo memory info11 = tokensInfos[0];
        Assert.equal(info11.id, 1, "Wrong id.");
        Assert.equal(info11.number , 11, "Wrong number.");
        Assert.equal(info11.uri, "11.json", "Wrong URI.");
        Assert.isTrue(info11.operation == Token.Operation.None, "Wrong operation.");
    }
}
