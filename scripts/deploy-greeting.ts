
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const name = "Sasha";

  console.log("Deploying Greeting contract...");

  const greeting = await ethers.deployContract("Greeting", [name]);

  await greeting.waitForDeployment();

  console.log("Greeting deployed to:", await greeting.getAddress());

  const transaction = greeting.deploymentTransaction();

  if (transaction) {
    console.log("Transaction hash:", transaction.hash);
    console.log(
      "Sepolia Etherscan:",
      `https://sepolia.etherscan.io/tx/${transaction.hash}`
    );
  }

  const message = await greeting.greet();
  console.log("greet() result:", message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
