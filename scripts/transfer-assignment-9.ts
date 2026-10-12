
import { network } from "hardhat";

const CONTRACT_ADDRESS =
  "0x9b62e5E54d28B6DbE19763549d2a6C8917F7FC42";

const RECIPIENT =
  "0xf6a583b7fF0dc7682BCFA48016571e03d3b214d1";

async function main() {
  const { ethers } = await network.connect();
  const [sender] = await ethers.getSigners();

  const currentNetwork = await ethers.provider.getNetwork();

  if (currentNetwork.chainId !== 11155111n) {
    throw new Error("This script must run on Sepolia.");
  }

  const game = await ethers.getContractAt(
    "GameCharacterCollectionERC1155",
    CONTRACT_ADDRESS
  );

  const tokenIds = [1, 2];
  const amounts = [1, 1];

  console.log("Network: Sepolia");
  console.log("From:", sender.address);
  console.log("To:", RECIPIENT);
  console.log("Contract:", CONTRACT_ADDRESS);

  for (const id of tokenIds) {
    const balance = await game.balanceOf(sender.address, id);

    if (balance < 1n) {
      throw new Error(`Not enough tokens for character ${id}`);
    }
  }

  const fees = await ethers.provider.getFeeData();

  if (
    fees.maxFeePerGas === null ||
    fees.maxPriorityFeePerGas === null
  ) {
    throw new Error("EIP-1559 fees unavailable.");
  }

  console.log("Transferring characters #1 and #2...");

  const tx = await game.safeBatchTransferFrom(
    sender.address,
    RECIPIENT,
    tokenIds,
    amounts,
    "0x",
    {
      maxFeePerGas: fees.maxFeePerGas,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    }
  );

  console.log("Transaction hash:", tx.hash);

  await tx.wait();

  console.log("Transaction confirmed!");

  console.log(
    "Recipient character #1:",
    (await game.balanceOf(RECIPIENT, 1)).toString()
  );

  console.log(
    "Recipient character #2:",
    (await game.balanceOf(RECIPIENT, 2)).toString()
  );

  console.log(
    "Etherscan:",
    `https://sepolia.etherscan.io/tx/${tx.hash}`
  );

  console.log("ASSIGNMENT 9 BATCH TRANSFER COMPLETED!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
