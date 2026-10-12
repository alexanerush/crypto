import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const proxyAddress = "0xa92681dC1B3FD9E125e9c9c42304a568532189C5";

  const [owner] = await ethers.getSigners();

  if (!owner) {
    throw new Error("No owner account configured");
  }

  const token = await ethers.getContractAt("MyTokenV2", proxyAddress);

  const version = await token.version();
  const totalSupply = await token.totalSupply();
  const ownerBalance = await token.balanceOf(owner.address);

  const recipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const recipientBalance = await token.balanceOf(recipientAddress);

  console.log("Network: Sepolia");
  console.log("Proxy address:", proxyAddress);
  console.log("Version:", version);
  console.log("Total supply:", ethers.formatUnits(totalSupply, 18));
  console.log("Owner balance:", ethers.formatUnits(ownerBalance, 18));
  console.log("Recipient balance:", ethers.formatUnits(recipientBalance, 18));

  if (
    version !== "V2" ||
    totalSupply !== ethers.parseUnits("1000000", 18) ||
    ownerBalance !== ethers.parseUnits("999900", 18) ||
    recipientBalance !== ethers.parseUnits("100", 18)
  ) {
    throw new Error("Verification failed");
  }

  console.log("SUCCESS: Sepolia upgrade and balances verified!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
