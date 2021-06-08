// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Expression.sol";

contract TestStacks {

    function testNumStackPush() public {
        NumStack memory numStack;

        NumStackInit(numStack, 3);
        Assert.equal(numStack.nums.length, 3, "Wrong NumStack length.");

        NumStackPush(numStack, 11);
        NumStackPush(numStack, 22);
        NumStackPush(numStack, 33);

        Assert.equal(NumStackLen(numStack), 3, "Wrong NumStack head after pushing.");
        Assert.equal(numStack.nums[0], 11, "Wrong NumStack pushed value 0.");
        Assert.equal(numStack.nums[1], 22, "Wrong NumStack pushed value 1.");
        Assert.equal(numStack.nums[2], 33, "Wrong NumStack pushed value 2.");

        int64 n = NumStackPop(numStack);    
        Assert.equal(NumStackLen(numStack), 2, "Wrong NumStack head after popping.");
        Assert.equal(n, 33, "Wrong NumStack popped value.");

        Assert.equal(NumStackTail(numStack), 11, "Wrong NumStack pushed value.");
    }

    function testOpStackPush() public {
        OpStack memory opStack;

        OpStackInit(opStack, 3);
        Assert.equal(opStack.ops.length, 3, "Wrong OpStack length.");

        OpStackPush(opStack, Token.Operation.Add);
        OpStackPush(opStack, Token.Operation.Sub);
        OpStackPush(opStack, Token.Operation.Mul);

        Assert.equal(OpStackLen(opStack), 3, "Wrong OpStack head after pushing.");
        Assert.isTrue(opStack.ops[0] == Token.Operation.Add, "Wrong OpStack pushed value 0.");
        Assert.isTrue(opStack.ops[1] == Token.Operation.Sub, "Wrong OpStack pushed value 1.");
        Assert.isTrue(opStack.ops[2] == Token.Operation.Mul, "Wrong OpStack pushed value 2.");

        Token.Operation op = OpStackPop(opStack);    
        Assert.equal(OpStackLen(opStack), 2, "Wrong OpStack head after popping.");
        Assert.isTrue(op == Token.Operation.Mul, "Wrong OpStack popped value.");

        Assert.isTrue(OpStackTail(opStack) == Token.Operation.Add, "Wrong OpStack pushed value.");
    }

}
