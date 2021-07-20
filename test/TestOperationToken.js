const Token = artifacts.require("Token");

contract("TestOperationToken", async accounts => {
    var token;
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
        caller = accounts[0];
        initialOwner = accounts[1];
    });

    it("testMintInitialTokens", async () => {
        await token.mintOperation(initialOwner, "http://add.json", opAdd);
        await token.mintOperation(initialOwner, "http://sub.json", opSub);
        await token.mintOperation(initialOwner, "http://mul.json", opMul);
        await token.mintOperation(initialOwner, "http://div.json", opDiv);

        tokenIdAdd = 1;
        tokenIdSub = 2;
        tokenIdMul = 3;
        tokenIdDiv = 4;

        balance = await token.balanceOf.call(initialOwner, {from: caller});
        assert.equal(balance.toNumber(), 4, "Wrong initial nums + ops balance.");
    });

    it("testGetTokenInfos", async () => {
        // Get the TokenInfos
        const infos = await token.getTokenInfos.call(initialOwner, {from: caller});
        
        // Check the length of the TokenInfos
        assert.equal(infos.length, 4, "Wrong number of TokenInfos.");

        // Check the content of info at index 0
        const info0 = infos[0];
        assert.equal(info0.id, 1, "Wrong id for TokenInfo[0].");
        assert.equal(info0.operation, tokenIdAdd, "Wrong type for TokenInfo[0].");
        assert.equal(info0.uri, "http://add.json", "Wrong uri for TokenInfo[0].");
        
        // Check the content of info at index 1
        const info1 = infos[1];
        assert.equal(info1.id, 2, "Wrong id for TokenInfo[1].");
        assert.equal(info1.operation, tokenIdSub, "Wrong type for TokenInfo[1].");
        assert.equal(info1.uri, "http://sub.json", "Wrong uri for TokenInfo[1].");
    });

    it("testCalculate", async () => {
        const a = 15;
        const b = 5;

        const resultAdd = await token.runOperation.call(opAdd, a, b);
        const resultSub = await token.runOperation.call(opSub, a, b);
        const resultMul = await token.runOperation.call(opMul, a, b);
        const resultDiv = await token.runOperation.call(opDiv, a, b);

        assert.equal(resultAdd.toNumber(), 20, "Expected 15 + 5 = 20.");
        assert.equal(resultSub.toNumber(), 10, "Expected 15 - 5 = 10.");
        assert.equal(resultMul.toNumber(), 75, "Expected 15 * 5 = 75.");
        assert.equal(resultDiv.toNumber(), 3,  "Expected 15 / 5 = 3.");
    });

});

