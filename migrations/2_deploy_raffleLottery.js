var raffleLottery = artifacts.require("./raffleLottery.sol");

module.exports = function (deployer) {
  deployer.deploy(raffleLottery);
};