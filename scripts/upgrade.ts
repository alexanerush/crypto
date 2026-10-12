
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const proxyAddress = "0xa92681dC1B3FD9E125e9c9c42304a568532189C5";

  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    throw new Error("No deployer account configured");
  }

  console.log("Network: Sepolia");
  console.log("Upgrading with account:", deployer.address);
  console.log("Proxy address:", proxyAddress);

  const tokenV1 = await ethers.getContractAt("MyTokenV1", proxyAddress);

  const balanceBefore = await tokenV1.balanceOf(deployer.address);
  const supplyBefore = await tokenV1.totalSupply();

  console.log(
    "Balance before upgrade:",
    ethers.formatUnits(balanceBefore, 18)
  );

  console.log(
    "Total supply before upgrade:",
    ethers.formatUnits(supplyBefore, 18)
  );

  const implementationV2 = await ethers.deployContract("MyTokenV2");
  await implementationV2.waitForDeployment();

  const implementationAddress = await implementationV2.getAddress();

  console.log("V2 implementation:", implementationAddress);

  const upgradeTx = await tokenV1.upgradeToAndCall(
    implementationAddress,
    "0x"
  );

  const receipt = await upgradeTx.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Upgrade transaction failed");
  }

  console.log("Upgrade transaction:", upgradeTx.hash);

  const tokenV2 = await ethers.getContractAt("MyTokenV2", proxyAddress);

  const version = await tokenV2.version();
  const balanceAfter = await tokenV2.balanceOf(deployer.address);
  const supplyAfter = await tokenV2.totalSupply();

  console.log("Version:", version);
  console.log(
    "Balance after upgrade:",
    ethers.formatUnits(balanceAfter, 18)
  );
  console.log(
    "Total supply after upgrade:",
    ethers.formatUnits(supplyAfter, 18)
  );

  if (
    version !== "V2" ||
    balanceBefore !== balanceAfter ||
    supplyBefore !== supplyAfter
  ) {
    throw new Error("Upgrade verification failed");
  }

  console.log(
    "Etherscan:",
    `https://sepolia.etherscan.io/tx/${upgradeTx.hash}`
  );

  console.log("SUCCESS: V2 deployed and token state preserved!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
