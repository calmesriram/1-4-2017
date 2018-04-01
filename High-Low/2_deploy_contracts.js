var High_Low = artifacts.require("./High_low.sol");

module.exports = function(deployer) {
  deployer.deploy(High_Low,{from:"0x40e4c0d08b1a74e98057c62bab30d53ca750d1ca"});
};
