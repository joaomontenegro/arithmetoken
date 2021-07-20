const Token = artifacts.require("Token");
const Expression = artifacts.require("Expression");

contract("TestExpression", async accounts => {
    var token;
    var expression;
    var caller;
    var initialOwner;
    const opAdd = 1;
    const opSub = 2;
    const opMul = 3;
    const opDiv = 4;
    var tokenIdAdd;
    var tokenIdSub;
    var tokenIdMul;
    var tokenIdDiv;

    beforeEach(async () => {    
        token = await Token.deployed();
        expression = await Expression.deployed();
        caller = accounts[0];
        initialOwner = accounts[1];
    });

    it("testMintInitialTokens", async () => {
        // Mint the initial tokens
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const uris = [
            "1.json",
            "2.json",
            "3.json",
            "4.json",
            "5.json",
            "6.json",
            "7.json",
            "8.json",
            "9.json"
        ];

        await token.mintInitialNumbers(initialOwner, numbers, uris, {from: caller});

        // Check the initial balance
        var balance = await token.balanceOf.call(initialOwner, {from: caller});
        assert.equal(balance.toNumber(), 9, "Wrong initial nums balance.");
        
        await token.mintOperation(initialOwner, "http://add.json", opAdd);
        await token.mintOperation(initialOwner, "http://sub.json", opSub);
        await token.mintOperation(initialOwner, "http://mul.json", opMul);
        await token.mintOperation(initialOwner, "http://div.json", opDiv);

        tokenIdAdd = balance.toNumber() + 1;
        tokenIdSub = balance.toNumber() + 2;
        tokenIdMul = balance.toNumber() + 3;
        tokenIdDiv = balance.toNumber() + 4;

        balance = await token.balanceOf.call(initialOwner, {from: caller});
        assert.equal(balance.toNumber(), 13, "Wrong initial nums + ops balance.");
    });

    it("testCalculateNumber", async () => {
        const tokenIds = [1];
        const value = await expression.calculate.call(tokenIds, {from: caller});
        assert.equal(value.toNumber(), 1, "Expected 1 = 1.");
    });

    it("testCalculateAdd", async () => {
        const tokenIds = [1, tokenIdAdd, 2];
        const value = await expression.calculate.call(tokenIds, {from: caller});
        assert.equal(value.toNumber(), 3, "Expected 1 + 2 = 3.");
    });

    it("testCalculateSub", async () => {
        const tokenIds = [6, tokenIdSub, 2];
        const value = await expression.calculate.call(tokenIds, {from: caller});
        assert.equal(value.toNumber(), 4, "Expected 6 - 2 = 4.");
    });

    it("testCalculateMul", async () => {
        const tokenIds = [3, tokenIdMul, 5];
        const value = await expression.calculate.call(tokenIds, {from: caller});
        assert.equal(value.toNumber(), 15, "Expected 3 * 5 = 15.");
    });

    it("testCalculateDiv", async () => {
        const tokenIds = [8, tokenIdDiv, 4];
        const value = await expression.calculate.call(tokenIds, {from: caller});
        assert.equal(value.toNumber(), 2, "Expected 8 / 4 = 2.");
    });

    it("testCalculatePrecedence", async () => {
        const tokenIds = [1, tokenIdAdd, 2, tokenIdMul, 3, tokenIdAdd, 4];
        const value = await expression.calculate.call(tokenIds, {from: caller});
        assert.equal(value.toNumber(), 11, "Expected 1 + 2 * 3 + 4 = 11.");
    });

    it("testCalculateInvalid", async () => {
        const tokenIds = [1, tokenIdAdd, tokenIdSub];

        try {
            const value = await expression.calculate.call(tokenIds, {from: caller});
            assert.fail("Expected exception.");
        } catch (error) {
            assert.include(error.message, "revert", "The error message should contain 'revert'");
        }
        
    });

});

