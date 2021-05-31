// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MathToken.sol";

contract TestNumberToken {

    function testInitialBalanceUsingDeployedContract() public {
        MathToken numToken = MathToken(DeployedAddresses.MathToken());

        Assert.equal(numToken.balanceOf(tx.origin), 0, "Owner should have 0 MathToken initially");
    }

    function testInitialBalanceWithNewNumberToken() public {
        MathToken numToken = new MathToken();

        Assert.equal(numToken.balanceOf(tx.origin), 0, "Owner should have 0 MathToken initially");
    }

    function testMint() public {
        MathToken numToken = new MathToken();
        int64 number = 123;
        uint256 tokenId = numToken.mintNumber(tx.origin, "http://123.json", number);

        Assert.equal(numToken.balanceOf(tx.origin), 1, "Owner should have 1 MathToken after calling mint()");
        Assert.equal(numToken.getNumber(tokenId), number, "Expected number should be 123.");
    }


}
