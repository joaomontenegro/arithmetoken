// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../src/contracts/Token.sol";

contract TestOperationToken {
    /* TODO: too big? 
    function testMintOperation() public {
        Token opToken = new Token();
        uint256 tokenId = opToken.mintOperation(tx.origin, "add.json", Token.Operation.Add);

        Assert.equal(opToken.balanceOf(tx.origin), 1, "Owner should have 1 Token");
        Assert.isTrue(opToken.getOperation(tokenId) == Token.Operation.Add, "Expected Add.");
        Assert.equal(opToken.getOperationText(tokenId), "+", "Expected '+'.");
    }
    */

    function testCalculate() public {
        Token opToken = new Token();

        int64 a = 15;
        int64 b = 5;

        Assert.equal(opToken.runOperation(Token.Operation.Add, a, b), 20, "Expected 15 + 5 = 20.");
        Assert.equal(opToken.runOperation(Token.Operation.Sub, a, b), 10, "Expected 15 - 5 = 10.");
        Assert.equal(opToken.runOperation(Token.Operation.Mul, a, b), 75, "Expected 15 * 5 = 75.");
        Assert.equal(opToken.runOperation(Token.Operation.Div, a, b), 3,  "Expected 15 / 5 = 3.");

    }

    /* TODO: too big? 
    function testGetTokenInfos() public {
        Token opToken = new Token();
        uint256 addId = opToken.mintOperation(tx.origin, "add.json", Token.Operation.Add);
        uint256 subId = opToken.mintOperation(tx.origin, "sub.json", Token.Operation.Sub);

        Assert.equal(opToken.balanceOf(tx.origin), 2, "Balance of owner should have 2 Tokens.");

        Token.TokenInfo[] memory tokensInfos = opToken.getTokenInfos(tx.origin);
        Assert.equal(tokensInfos.length, 2, "Tokens list of owner should have 2 Tokens.");

        Token.TokenInfo memory infoAdd = tokensInfos[0];
        Assert.equal(infoAdd.id, addId, "Wrong id.");
        Assert.equal(infoAdd.number, 0, "Wrong number.");
        Assert.equal(infoAdd.uri, "add.json", "Wrong URI.");
        Assert.isTrue(infoAdd.operation == Token.Operation.Add, "Wrong operation.");

        Token.TokenInfo memory infoSub = tokensInfos[1];
        Assert.equal(infoSub.id, subId, "Wrong id.");
        Assert.equal(infoSub.number, 0, "Wrong number.");
        Assert.equal(infoSub.uri, "sub.json", "Wrong URI.");
        Assert.isTrue(infoSub.operation == Token.Operation.Sub, "Wrong operation.");

    }
    */

}
