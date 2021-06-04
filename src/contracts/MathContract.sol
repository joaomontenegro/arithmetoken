// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

struct NumStack {
    int64[] nums;
    uint256 head;
}

function NumStackInit(NumStack memory stack, uint256 len) pure
{
    stack.nums = new int64[](len);
    stack.head = 0;
}

function NumStackPush(NumStack memory stack, int64 num) pure
{
    //TODO: test size?
    stack.nums[stack.head] = num;
    stack.head++;
}

function NumStackPop(NumStack memory stack) pure returns (int64)
{
    //TODO: test if len is zero
    stack.head--;
    return stack.nums[stack.head];
}

function NumStackHead(NumStack memory stack) pure returns (int64)
{
    //TODO: test if len is zero
    return stack.nums[stack.head - 1];
}

function NumStackTail(NumStack memory stack) pure returns (int64)
{
    //TODO: test if len is zero
    return stack.nums[0];
}

function NumStackLen(NumStack memory stack) pure returns (uint256)
{
    return stack.head;
}

struct OpStack {
    Token.Operation[] ops;
    uint256 head;
}

function OpStackInit(OpStack memory stack, uint256 len) pure
{
    stack.ops = new Token.Operation[](len);
    stack.head = 0;
}

function OpStackPush(OpStack memory stack, Token.Operation op) pure
{
    //TODO: test size?
    stack.ops[stack.head] = op;
    stack.head++;
}

function OpStackPop(OpStack memory stack) pure returns (Token.Operation)
{
    //TODO: test if len is zero
    stack.head--;
    return stack.ops[stack.head];
}

function OpStackHead(OpStack memory stack) pure returns (Token.Operation)
{
    //TODO: test if len is zero
    return stack.ops[stack.head - 1];
}

function OpStackTail(OpStack memory stack) pure returns (Token.Operation)
{
    //TODO: test if len is zero
    return stack.ops[0];
}

function OpStackLen(OpStack memory stack) pure returns (uint256)
{
    return stack.head;
}

contract MathContract {
    Token private token;

    constructor(Token _token) {
        token = _token;
    }

    // TODO: mint with the result of calculate

    function calculate(uint256[] memory tokens) public view returns (int64)
    {
        NumStack memory numStack;
        OpStack memory opStack;

        //TODO: Better sizes?
        NumStackInit(numStack, tokens.length);
        OpStackInit(opStack, tokens.length);

        for (uint i=0; i < tokens.length; i++) {
            uint256 tokenId = tokens[i];

            if (token.getType(tokenId) == Token.Type.Number) {
                // Add to the operand stack
                NumStackPush(numStack, token.getNumber(tokenId));
            } else {
                Token.Operation op = token.getOperation(tokenId);

                if (OpStackLen(opStack) >  0) {
                    Token.Operation topOp = OpStackHead(opStack);

                    if (op <= topOp) {
                        _runTopOp(numStack, opStack);
                    }
                }

                OpStackPush(opStack, op);
            }
        }

        // Iterate through the operations in the stack and process them
        while (OpStackLen(opStack) > 0) {
            _runTopOp(numStack, opStack);
        }

        // Return the first number in the stack, which should be the result.
        return NumStackTail(numStack);
    }

    function _runTopOp(NumStack memory numStack, OpStack memory opStack) internal view
    {
        Token.Operation op = OpStackPop(opStack);

        int64 v2 = NumStackPop(numStack);
        int64 v1 = NumStackPop(numStack);

        int64 v = token.runOperation(op, v1, v2);
        NumStackPush(numStack, v);
    }
}