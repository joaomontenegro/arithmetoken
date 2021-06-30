

const Token = artifacts.require("Token");


contract("TestNumberToken", async accounts => {
    it("should mint Number Token", async () => {
        const instance = await Token.deployed();

        const number = 123;
        await instance.mintNumber(accounts[0], "123.json", number, {from: accounts[0]});

        const balance = await instance.balanceOf.call(accounts[0], {from: accounts[0]});

        assert.equal(balance.toNumber(), 1,
            "Owner should have 1 Token after calling mintNumber()");

        const tokenId = 1;
        const resultNumber = await instance.getNumber.call(tokenId);
        assert.equal(resultNumber.toNumber() , number,
            "Expected number should be 123");
      });
});


/*

contract TestNumberToken {
    function testMint() public {
        Token numToken = new Token();
        int64 number = 123;
        uint256 tokenId = numToken.mintNumber(tx.origin, "123.json", number);

        Assert.equal(numToken.balanceOf(tx.origin), 1, "Owner should have 1 Token after calling mint()");
        Assert.equal(numToken.getNumber(tokenId), number, "Expected number should be 123.");
    }


    function testGetTokenInfos() public {
        Token numToken = new Token();
        numToken.mintNumber(tx.origin, "11.json", 11);
        numToken.mintNumber(tx.origin, "22.json", 22);

        Assert.equal(numToken.balanceOf(tx.origin), 2, "Balance should have 2 Tokens.");

        Token.TokenInfo[] memory tokensInfos = numToken.getTokenInfos(tx.origin);
        Assert.equal(tokensInfos.length, 2, "Tokens list should have 2 Tokens.");

        Token.TokenInfo memory info11 = tokensInfos[0];
        Assert.equal(info11.id, 1, "Wrong id.");
        Assert.equal(info11.number , 11, "Wrong number.");
        Assert.equal(info11.uri, "11.json", "Wrong URI.");
        Assert.isTrue(info11.operation == Token.Operation.None, "Wrong operation.");
    }

    function testMintTwiceError() public {
        Token numToken = new Token();
        numToken.mintNumber(tx.origin, "1.json", 1);
        numToken.mintNumber(tx.origin, "2.json", 2);

        try numToken.mintNumber(tx.origin, "1.json", 1) returns (uint256) {
            Assert.fail("An exception was expected when minting 1 twice.");
        } catch {
        }
    }

    function testMintInitial() public {
        Token numToken = new Token();

        int64 num = 0;
        for (uint8 i = 0; i < numToken._initialMax(); ++i) {
            numToken.mintNumber(tx.origin, "a.json", num);
            num++;
        }
        
        try numToken.mintNumber(tx.origin, "b.json", num) returns (uint256) {
            Assert.fail("More than the max initial tokens were minted.");
        } catch {
        }
    }

    
}

*/