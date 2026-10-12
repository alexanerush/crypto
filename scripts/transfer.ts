import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const proxyAddress = "0xa92681dC1B3FD9E125e9c9c42304a568532189C5";
  const recipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const [owner] = await ethers.getSigners();

  if (!owner) {
    throw new Error("No deployer account configured");
  }

  const token = await ethers.getContractAt("MyTokenV1", proxyAddress);
  const amount = ethers.parseUnits("100", 18);

  console.log("Network: Sepolia");
  console.log("Proxy address:", proxyAddress);
  console.log("Sender:", owner.address);
  console.log("Recipient:", recipientAddress);

  const senderBefore = await token.balanceOf(owner.address);
  const recipientBefore = await token.balanceOf(recipientAddress);

  console.log("Sender balance before:", ethers.formatUnits(senderBefore, 18));
  console.log("Recipient balance before:", ethers.formatUnits(recipientBefore, 18));

  const tx = await token.transfer(recipientAddress, amount);
  console.log("Transfer transaction:", tx.hash);

  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Transfer transaction failed");
  }

  const senderAfter = await token.balanceOf(owner.address);
  const recipientAfter = await token.balanceOf(recipientAddress);

  console.log("Sender balance after:", ethers.formatUnits(senderAfter, 18));
  console.log("Recipient balance after:", ethers.formatUnits(recipientAfter, 18));
  console.log("Etherscan:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
