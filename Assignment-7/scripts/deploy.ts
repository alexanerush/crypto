
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const initialSupply = ethers.parseUnits("1000000", 18);

  const implementation = await ethers.deployContract("MyTokenV1");
  await implementation.waitForDeployment();

  const implementationAddress = await implementation.getAddress();

  console.log("V1 implementation:", implementationAddress);

  const initializationData =
    implementation.interface.encodeFunctionData("initialize", [
      initialSupply,
    ]);

  const proxy = await ethers.deployContract("MyTokenProxy", [
    implementationAddress,
    initializationData,
  ]);

  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();

  console.log("Proxy address:", proxyAddress);

  const token = await ethers.getContractAt("MyTokenV1", proxyAddress);

  console.log("Token name:", await token.name());
  console.log("Token symbol:", await token.symbol());

  console.log(
    "Total supply:",
    ethers.formatUnits(await token.totalSupply(), 18)
  );

  console.log("Owner:", await token.owner());

  console.log(
    "Deployer balance:",
    ethers.formatUnits(await token.balanceOf(deployer.address), 18)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
