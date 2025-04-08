require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/388e74002aab47b1a25d0b17ad52d441",
      accounts: ["9919862230f6a80003df3f78eb8813b35cce54cc9aaf7d005d9d14953ec12b4f"]
    }
  }
};
