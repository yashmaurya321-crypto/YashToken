const { ethers } = require("hardhat");

async function main() {
  const YashToken = await ethers.getContractFactory("YashToken");
  const initialSupply = 1000000;
  const token = await YashToken.deploy(initialSupply);
  await token.waitForDeployment();
  
  const address = await token.getAddress();
  console.log("YashToken deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//token deployed to : 0xB7F9415d40B933204FB3fCE5C5941A84bab094Bb