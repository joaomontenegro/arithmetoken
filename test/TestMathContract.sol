// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MathContract.sol";
import "../contracts/MathToken.sol";

contract TestMathContract {

    function testCalculateNumber() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());
        uint256 tokenId = numToken.mintNumber(tx.origin, "http://123.json", 123);
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = tokenId;

        MathContract mathContract = MathContract(DeployedAddresses.MathContract());

        Assert.equal(mathContract.calculate(tokenIds), 123, "Expected 123 = 123.");
    }

    function testCalculateAdd() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());
        
        uint256 tokenId1 = numToken.mintNumber(tx.origin, "http://1.json", 1);
        uint256 tokenId2 = numToken.mintNumber(tx.origin, "http://2.json", 2);
        uint256 tokenIdAdd = numToken.mintOperation(tx.origin, "http://add.json", MathToken.Operation.Add);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenId2;

        MathContract mathContract = MathContract(DeployedAddresses.MathContract());

        Assert.equal(mathContract.calculate(tokenIds), 3, "Expected 1 + 2 = 3.");
    }

    function testCalculateSub() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());
        
        uint256 tokenId7 = numToken.mintNumber(tx.origin, "http://7.json", 7);
        uint256 tokenId5 = numToken.mintNumber(tx.origin, "http://5.json", 5);
        uint256 tokenIdSub = numToken.mintOperation(tx.origin, "http://sub.json", MathToken.Operation.Sub);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId7;
        tokenIds[1] = tokenIdSub;
        tokenIds[2] = tokenId5;

        MathContract mathContract = MathContract(DeployedAddresses.MathContract());

        Assert.equal(mathContract.calculate(tokenIds), 2, "Expected 7 - 5 = 2.");
    }

    function testCalculateMul() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());
        
        uint256 tokenId3 = numToken.mintNumber(tx.origin, "http://3.json", 3);
        uint256 tokenId4 = numToken.mintNumber(tx.origin, "http://4.json", 4);
        uint256 tokenIdMul = numToken.mintOperation(tx.origin, "http://mul.json", MathToken.Operation.Mul);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId3;
        tokenIds[1] = tokenIdMul;
        tokenIds[2] = tokenId4;

        MathContract mathContract = MathContract(DeployedAddresses.MathContract());

        Assert.equal(mathContract.calculate(tokenIds), 12, "Expected 3 * 4 = 12.");
    }


    function testCalculateDiv() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());
        
        uint256 tokenId6 = numToken.mintNumber(tx.origin, "http://6.json", 6);
        uint256 tokenId3 = numToken.mintNumber(tx.origin, "http://3.json", 3);
        uint256 tokenIdDiv = numToken.mintOperation(tx.origin, "http://div.json", MathToken.Operation.Div);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId6;
        tokenIds[1] = tokenIdDiv;
        tokenIds[2] = tokenId3;

        MathContract mathContract = MathContract(DeployedAddresses.MathContract());

        Assert.equal(mathContract.calculate(tokenIds), 2, "Expected 6 / 3 = 2.");
    }

    function testCalculatePrecedence() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());
        
        uint256 tokenId1 = numToken.mintNumber(tx.origin, "http://1.json", 1);
        uint256 tokenId2 = numToken.mintNumber(tx.origin, "http://2.json", 2);
        uint256 tokenId3 = numToken.mintNumber(tx.origin, "http://3.json", 3);
        uint256 tokenId4 = numToken.mintNumber(tx.origin, "http://4.json", 4);
        uint256 tokenIdAdd = numToken.mintOperation(tx.origin, "http://add.json", MathToken.Operation.Add);
        uint256 tokenIdMul = numToken.mintOperation(tx.origin, "http://mul.json", MathToken.Operation.Mul);
        
        uint256[] memory tokenIds = new uint256[](7);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenId2;
        tokenIds[3] = tokenIdMul;
        tokenIds[4] = tokenId3;
        tokenIds[5] = tokenIdAdd;
        tokenIds[6] = tokenId4;

        MathContract mathContract = MathContract(DeployedAddresses.MathContract());

        Assert.equal(mathContract.calculate(tokenIds), 11, "Expected 1 + 2 * 3 + 4 = 11.");
    }

    //TODO: detect errors in code?
    function testCalculateInvalid() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());
        
        uint256 tokenId1 = numToken.mintNumber(tx.origin, "http://1.json", 1);
        uint256 tokenIdAdd = numToken.mintOperation(tx.origin, "http://add.json", MathToken.Operation.Add);
        uint256 tokenIdMul = numToken.mintOperation(tx.origin, "http://mul.json", MathToken.Operation.Mul);
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenIdAdd;
        tokenIds[2] = tokenIdMul;

        MathContract mathContract = MathContract(DeployedAddresses.MathContract());

        try mathContract.calculate(tokenIds) returns (int64) {
            Assert.equal(mathContract.calculate(tokenIds), 11, "Expected exception!");
        } catch {}        
    }

}
