 import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();

  const balance = await ethers.provider.getBalance(
    deployer.address
  );

  const feeData = await ethers.provider.getFeeData();
  const block = await ethers.provider.getBlock("latest");

  const gwei = (value: bigint | null) =>
    value === null ? "Not available" : ethers.formatUnits(value, "gwei");

  console.log("Network:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  console.log("Gas price:", gwei(feeData.gasPrice), "gwei");
  console.log("Max fee:", gwei(feeData.maxFeePerGas), "gwei");
  console.log("Priority fee:", gwei(feeData.maxPriorityFeePerGas), "gwei");
  console.log("Base fee:", gwei(block?.baseFeePerGas ?? null), "gwei");

  const gasLimits = [
    { name: "ERC721", gas: 10_000_000n },
    { name: "ERC1155", gas: 15_000_000n },
  ];

  if (feeData.maxFeePerGas !== null) {
    for (const contract of gasLimits) {
      const maxCost = contract.gas * feeData.maxFeePerGas;

      console.log(
        `${contract.name} estimated maximum reservation:`,
        ethers.formatEther(maxCost),
        "ETH"
      );
    }
  }
}

main().catch(console.error);
