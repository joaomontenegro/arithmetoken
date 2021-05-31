// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MathToken.sol";

contract TestOperationToken {

  function testInitialBalanceUsingDeployedContract() public {
    MathToken opToken = MathToken(DeployedAddresses.MathToken());

    Assert.equal(opToken.balanceOf(tx.origin), 0, "Owner should have 0 MathToken initially");
  }

  function testInitialBalanceWithNewOperationToken() public {
    MathToken opToken = new MathToken();

    Assert.equal(opToken.balanceOf(tx.origin), 0, "Owner should have 0 MathToken initially");
  }
  
  function testMintOperation() public {
    MathToken opToken = new MathToken();
    uint256 tokenId = opToken.mintOperation(tx.origin, "http://add.json", MathToken.Operation.Add);

    Assert.equal(opToken.balanceOf(tx.origin), 1, "Owner should have 1 MathToken after calling mint()");
    Assert.isTrue(opToken.getOperation(tokenId) == MathToken.Operation.Add, "Expected operation should be Add.");
  }

  function testCalculate() public {
    MathToken opToken = new MathToken();
    uint256 addId = opToken.mintOperation(tx.origin, "http://add.json", MathToken.Operation.Add);
    uint256 subId = opToken.mintOperation(tx.origin, "http://sub.json", MathToken.Operation.Sub);
    uint256 mulId = opToken.mintOperation(tx.origin, "http://mul.json", MathToken.Operation.Mul);
    uint256 divId = opToken.mintOperation(tx.origin, "http://dic.json", MathToken.Operation.Div);

    int64 a = 15;
    int64 b = 5;

    Assert.equal(opToken.runOperation(addId, a, b), 20, "Expected 15 + 5 = 20.");
    Assert.equal(opToken.runOperation(subId, a, b), 10, "Expected 15 - 5 = 10.");
    Assert.equal(opToken.runOperation(mulId, a, b), 75, "Expected 15 * 5 = 75.");
    Assert.equal(opToken.runOperation(divId, a, b), 3,  "Expected 15 / 5 = 3.");

  }

}
