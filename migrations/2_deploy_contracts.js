const MathToken = artifacts.require("MathToken");
const MathContract = artifacts.require("MathContract");

module.exports = async function (deployer) {
  await deployer.deploy(MathToken);
  const mathToken = await MathToken.deployed()

  await deployer.deploy(MathContract, mathToken.address);
  const mathContract = await MathContract.deployed()

  //TODO: set permissions?
};
