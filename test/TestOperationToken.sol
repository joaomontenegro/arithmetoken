// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Token.sol";

contract TestOperationToken {

  function testInitialBalanceUsingDeployedContract() public {
    Token opToken = Token(DeployedAddresses.Token());

    Assert.equal(opToken.balanceOf(tx.origin), 0, "Owner should have 0 Token initially");
  }

  function testInitialBalanceWithNewOperationToken() public {
    Token opToken = new Token();

    Assert.equal(opToken.balanceOf(tx.origin), 0, "Owner should have 0 Token initially");
  }
  
  function testMintOperation() public {
    Token opToken = new Token();
    uint256 tokenId = opToken.mintOperation(tx.origin, "http://add.json", Token.Operation.Add);

    Assert.equal(opToken.balanceOf(tx.origin), 1, "Owner should have 1 Token after calling mint()");
    Assert.isTrue(opToken.getOperation(tokenId) == Token.Operation.Add, "Expected operation should be Add.");
  }

  function testCalculate() public {
    Token opToken = new Token();
    uint256 addId = opToken.mintOperation(tx.origin, "http://add.json", Token.Operation.Add);
    uint256 subId = opToken.mintOperation(tx.origin, "http://sub.json", Token.Operation.Sub);
    uint256 mulId = opToken.mintOperation(tx.origin, "http://mul.json", Token.Operation.Mul);
    uint256 divId = opToken.mintOperation(tx.origin, "http://dic.json", Token.Operation.Div);

    int64 a = 15;
    int64 b = 5;

    Assert.equal(opToken.runOperation(addId, a, b), 20, "Expected 15 + 5 = 20.");
    Assert.equal(opToken.runOperation(subId, a, b), 10, "Expected 15 - 5 = 10.");
    Assert.equal(opToken.runOperation(mulId, a, b), 75, "Expected 15 * 5 = 75.");
    Assert.equal(opToken.runOperation(divId, a, b), 3,  "Expected 15 / 5 = 3.");

  }

}
