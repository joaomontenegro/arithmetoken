const Token = artifacts.require("Token");
const Expression = artifacts.require("Expression");

module.exports = async function (deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed()

  await deployer.deploy(Expression, token.address);
  const expression = await Expression.deployed()

  await token.setMinter(expression.address);
  
  //TODO: set permissions?
};
