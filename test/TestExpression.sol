// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Expression.sol";
import "../src/contracts/Token.sol";

contract TestExpressionCalculations {

    uint256 tokenId1;
    uint256 tokenId2;
    uint256 tokenId3;
    uint256 tokenId4;
    uint256 tokenId5;
    uint256 tokenId6;
    uint256 tokenId7;
    uint256 tokenId8;
    uint256 tokenId9;

    function testMint() public {
        Token numToken = Token(DeployedAddresses.Token());
        
        tokenId1 = numToken.mintNumber(tx.origin, "http://1.json", 1);
        tokenId2 = numToken.mintNumber(tx.origin, "http://2.json", 2);
        tokenId3 = numToken.mintNumber(tx.origin, "http://3.json", 3);
        tokenId4 = numToken.mintNumber(tx.origin, "http://4.json", 4);
        tokenId5 = numToken.mintNumber(tx.origin, "http://5.json", 5);
        tokenId6 = numToken.mintNumber(tx.origin, "http://6.json", 6);
        tokenId7 = numToken.mintNumber(tx.origin, "http://7.json", 7);
        tokenId8 = numToken.mintNumber(tx.origin, "http://8.json", 8);
        tokenId9 = numToken.mintNumber(tx.origin, "http://9.json", 9);
    }

    function testCalculateNumber() public {
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = tokenId1;

        Expression expression = Expression(DeployedAddresses.Expression());

        Assert.equal(expression.calculate(tokenIds), 1, "Expected 1 = 1.");
    }

    function testCalculateAdd() public {
        Token numToken = Token(DeployedAddresses.Token());
        
        uint256 tokenIdAdd = numToken.mintOperation(tx.origin, "http://add.json", Token.Operation.Add);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenId2;

        Expression expression = Expression(DeployedAddresses.Expression());

        Assert.equal(expression.calculate(tokenIds), 3, "Expected 1 + 2 = 3.");
    }

    function testCalculateSub() public {
        Token numToken = Token(DeployedAddresses.Token());
        
        uint256 tokenIdSub = numToken.mintOperation(tx.origin, "http://sub.json", Token.Operation.Sub);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId5;
        tokenIds[1] = tokenIdSub;
        tokenIds[2] = tokenId3;

        Expression expression = Expression(DeployedAddresses.Expression());

        Assert.equal(expression.calculate(tokenIds), 2, "Expected 5 - 3 = 2.");
    }

    function testCalculateMul() public {
        Token numToken = Token(DeployedAddresses.Token());
        
        uint256 tokenIdMul = numToken.mintOperation(tx.origin, "http://mul.json", Token.Operation.Mul);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId6;
        tokenIds[1] = tokenIdMul;
        tokenIds[2] = tokenId7;

        Expression expression = Expression(DeployedAddresses.Expression());

        Assert.equal(expression.calculate(tokenIds), 42, "Expected 6 * 7 = 42.");
    }


    function testCalculateDiv() public {
        Token numToken = Token(DeployedAddresses.Token());
        
        uint256 tokenIdDiv = numToken.mintOperation(tx.origin, "http://div.json", Token.Operation.Div);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId6;
        tokenIds[1] = tokenIdDiv;
        tokenIds[2] = tokenId2;

        Expression expression = Expression(DeployedAddresses.Expression());

        Assert.equal(expression.calculate(tokenIds), 3, "Expected 6 / 2 = 3.");
    }
    
    function testCalculatePrecedence() public {
        Token numToken = Token(DeployedAddresses.Token());
        Expression expression = Expression(DeployedAddresses.Expression());
        
        uint256 tokenIdAdd = numToken.mintOperation(tx.origin, "http://add.json", Token.Operation.Add);
        uint256 tokenIdMul = numToken.mintOperation(tx.origin, "http://mul.json", Token.Operation.Mul);
        
        uint256[] memory tokenIds = new uint256[](7);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenId2;
        tokenIds[3] = tokenIdMul;
        tokenIds[4] = tokenId3;
        tokenIds[5] = tokenIdAdd;
        tokenIds[6] = tokenId4;

        Assert.equal(expression.calculate(tokenIds), 11, "Expected 1 + 2 * 3 + 4 = 11.");
    }

    //TODO: detect errors in code?
    function testCalculateInvalid() public {
        Token token = Token(DeployedAddresses.Token());
        Expression expression = Expression(DeployedAddresses.Expression());
        
        uint256 tokenIdAdd = token.mintOperation(tx.origin, "http://add.json", Token.Operation.Add);
        uint256 tokenIdMul = token.mintOperation(tx.origin, "http://mul.json", Token.Operation.Mul);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenIdMul;

        // TODO: Check the right type of exception?
        try expression.calculate(tokenIds) returns (int64) {
            Assert.equal(expression.calculate(tokenIds), 1, "Expected exception!");
        } catch {}
    }

    // TODO test permissions

}
