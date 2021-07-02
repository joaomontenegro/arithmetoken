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

    uint256 tokenIdOther; // token that belongs to another addr

    uint256 tokenIdAdd;
    uint256 tokenIdSub;
    uint256 tokenIdMul;
    uint256 tokenIdDiv;

    Token token;
    Expression expression;

    constructor() {
        token = Token(DeployedAddresses.Token());
        expression = Expression(DeployedAddresses.Expression());

        address owner = address(this);

        tokenId1 = token.mintNumber(owner, "http://1.json", 1);
        tokenId2 = token.mintNumber(owner, "http://2.json", 2);
        tokenId3 = token.mintNumber(owner, "http://3.json", 3);
        tokenId4 = token.mintNumber(owner, "http://4.json", 4);
        tokenId5 = token.mintNumber(owner, "http://5.json", 5);
        tokenId6 = token.mintNumber(owner, "http://6.json", 6);
        tokenId7 = token.mintNumber(owner, "http://7.json", 7);
        tokenId8 = token.mintNumber(owner, "http://8.json", 8);
        tokenId9 = token.mintNumber(owner, "http://9.json", 9);

        tokenIdOther = token.mintNumber(address(123), "http://other.json", -1);

        tokenIdAdd = token.mintOperation(owner, "http://add.json", Token.Operation.Add);
        tokenIdSub = token.mintOperation(owner, "http://sub.json", Token.Operation.Sub);
        tokenIdMul = token.mintOperation(owner, "http://mul.json", Token.Operation.Mul);
        tokenIdDiv = token.mintOperation(owner, "http://div.json", Token.Operation.Div);
    }


    function testInit() public {        
    }

    function testCalculateNumber() public {
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = tokenId1;

        Assert.equal(expression.calculate(tokenIds), 1, "Expected 1 = 1.");
    }

    function testCalculateAdd() public {
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenId2;

        Assert.equal(expression.calculate(tokenIds), 3, "Expected 1 + 2 = 3.");
    }

    function testCalculateSub() public {
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId5;
        tokenIds[1] = tokenIdSub;
        tokenIds[2] = tokenId3;

        Assert.equal(expression.calculate(tokenIds), 2, "Expected 5 - 3 = 2.");
    }

    function testCalculateMul() public {
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId6;
        tokenIds[1] = tokenIdMul;
        tokenIds[2] = tokenId7;

        Assert.equal(expression.calculate(tokenIds), 42, "Expected 6 * 7 = 42.");
    }


    function testCalculateDiv() public {
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId6;
        tokenIds[1] = tokenIdDiv;
        tokenIds[2] = tokenId2;

        Assert.equal(expression.calculate(tokenIds), 3, "Expected 6 / 2 = 3.");
    }
    
    function testCalculatePrecedence() public {
       
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
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenIdMul;

        // TODO: Check the right type of exception?
        try expression.calculate(tokenIds) returns (int64) {
            Assert.fail("Expected exception!");
        } catch {}
    }

    function testMint() public {

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenId9;

        uint256 newId = expression.mint("10.json", tokenIds);

        Assert.equal(newId, 15, "Wrong id of minted token.");
        Assert.equal(token.getNumber(newId), 10, "Wrong value of minted token.");

        // Add a token that belongs to another addr
        tokenIds[2] = tokenIdOther;
        try expression.mint("123.json", tokenIds) returns (uint256) {
            Assert.fail("Expected exception!");
        } catch {}

    }


    // TODO test permissions

}
