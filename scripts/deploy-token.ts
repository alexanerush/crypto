import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const initialSupply = ethers.parseUnits("1000000", 18);

  const token = await ethers.deployContract("MyToken", [initialSupply]);

  await token.waitForDeployment();

  console.log("MyToken deployed to:", await token.getAddress());
  console.log("Token name:", await token.name());
  console.log("Token symbol:", await token.symbol());
  console.log("Total supply:", ethers.formatUnits(await token.totalSupply(), 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});