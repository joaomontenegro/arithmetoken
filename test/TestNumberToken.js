const Token = artifacts.require("Token");

contract("TestNumberToken", async accounts => {
    it("testMintInitialTokens", async () => {
        var token = await Token.deployed();
        var caller = accounts[0];
        var initialOwner = accounts[1];

        // Mint the initial tokens
        const numbers = [11, 22, 33];
        const uris = ["11.json", "22.json", "33.json"];

        await token.mintInitialNumbers(initialOwner, numbers, uris, {from: caller});

        // Check the initial balance
        const balance = await token.balanceOf.call(initialOwner, {from: caller});
        assert.equal(balance.toNumber(), 3, "Wrong initial balance.");
    });

    it("testGetTokenInfos", async () => {
        var token = await Token.deployed();
        var caller = accounts[0];
        var initialOwner = accounts[1];

        // Check the initial balance
        const balance = await token.balanceOf.call(initialOwner, {from: caller});
        assert.equal(balance.toNumber(), 3, "Wrong initial balance.");

        // Get the TokenInfos
        const infos = await token.getTokenInfos.call(initialOwner, {from: caller});
        
        // Check the length of the TokenInfos
        assert.equal(infos.length, 3, "Wrong number of TokenInfos.");

        // Check the content of info at index 0
        const info0 = infos[0];
        assert.equal(info0.id, 1, "Wrong id for TokenInfo[0].");
        assert.equal(info0.number, 11, "Wrong number for TokenInfo[0].");
        assert.equal(info0.uri, "11.json", "Wrong uri for TokenInfo[0].");
        assert.equal(info0.operation, 0, "Wrong type for TokenInfo[0].");

        // Check the content of info at index 1
        const info1 = infos[1];
        assert.equal(info1.id, 2, "Wrong id for TokenInfo[1].");
        assert.equal(info1.number, 22, "Wrong number for TokenInfo[1].");
        assert.equal(info1.uri, "22.json", "Wrong uri for TokenInfo[1].");
        assert.equal(info1.operation, 0, "Wrong type for TokenInfo[1].");  
    });

});

