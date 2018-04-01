var register = artifacts.require("./Register.sol");
var Bank = artifacts.require("./Bank.sol");

module.exports = function(deployer) {
  deployer.deploy(register);
  deployer.link(register, Bank);
  deployer.deploy(Bank);
  
};
