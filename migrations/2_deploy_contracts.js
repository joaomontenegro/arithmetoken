const Token = artifacts.require("Token");
const MathContract = artifacts.require("MathContract");

module.exports = async function (deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed()

  await deployer.deploy(MathContract, token.address);
  const mathContract = await MathContract.deployed()

  //TODO: set permissions?
};
