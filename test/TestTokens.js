const Token = artifacts.require("Token");


contract("testInitialBalanceUsingDeployedContract", async accounts => {
    it("Owner should have 0 Token initially", async () => {
        const instance = await Token.deployed();
        const balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 0);
      });
});

