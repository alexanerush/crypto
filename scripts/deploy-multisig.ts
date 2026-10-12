
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const [owner1, owner2, owner3] = await ethers.getSigners();

  const factory = await ethers.getContractFactory("MultiSigWallet");

  const wallet = await factory.deploy(
    [owner1.address, owner2.address, owner3.address],
    2
  );

  await wallet.waitForDeployment();

  console.log("MultiSigWallet deployed successfully");
  console.log("Contract address:", await wallet.getAddress());
  console.log("Owner 1:", owner1.address);
  console.log("Owner 2:", owner2.address);
  console.log("Owner 3:", owner3.address);
  console.log("Required confirmations:", 
    (await wallet.requiredConfirmations()).toString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
