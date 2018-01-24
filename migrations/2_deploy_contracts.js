var WishingTree = artifacts.require("WishingTree");

module.exports = function(deployer) {
  deployer.deploy(WishingTree, {overwrite: true});
};
