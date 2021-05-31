// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MathContract.sol";

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

        OpStackPush(opStack, MathToken.Operation.Add);
        OpStackPush(opStack, MathToken.Operation.Sub);
        OpStackPush(opStack, MathToken.Operation.Mul);

        Assert.equal(OpStackLen(opStack), 3, "Wrong OpStack head after pushing.");
        Assert.isTrue(opStack.ops[0] == MathToken.Operation.Add, "Wrong OpStack pushed value 0.");
        Assert.isTrue(opStack.ops[1] == MathToken.Operation.Sub, "Wrong OpStack pushed value 1.");
        Assert.isTrue(opStack.ops[2] == MathToken.Operation.Mul, "Wrong OpStack pushed value 2.");

        MathToken.Operation op = OpStackPop(opStack);    
        Assert.equal(OpStackLen(opStack), 2, "Wrong OpStack head after popping.");
        Assert.isTrue(op == MathToken.Operation.Mul, "Wrong OpStack popped value.");

        Assert.isTrue(OpStackTail(opStack) == MathToken.Operation.Add, "Wrong OpStack pushed value.");
    }

}
