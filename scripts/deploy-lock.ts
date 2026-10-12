import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const unlockTime = Math.floor(Date.now() / 1000) + 86400;

  const lock = await ethers.deployContract("Lock", [unlockTime]);

  console.log("Waiting for deployment...");
  await lock.waitForDeployment();

  console.log("Lock deployed to:", await lock.getAddress());

  const transaction = lock.deploymentTransaction();

  if (transaction) {
    console.log("Transaction hash:", transaction.hash);
    console.log(
      "Sepolia Etherscan:",
      `https://sepolia.etherscan.io/tx/${transaction.hash}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
