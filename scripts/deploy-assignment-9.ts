import { network } from "hardhat";

const STUDENT_WALLET =
  "0xB631f3a41bb22286bB1Ceb327726DdFe05BAA3f1";

const STUDENT_METADATA =
  "ipfs://bafybeigdpf3qyuntgd352zilkupuvi4gc5nhynna3plsprep3qlx7kgq34/student-card.json";

const CHARACTERS_CID =
  "bafybeif24alqmcuab7ctnjvgad36ukg6xsbejgzr4mw2gkvfrnwamqn5vu";

const IMAGES_CID =
  "bafybeige66a4mzl6twou6xvr3dyt7mtharh6fql4du72vhlmxrhphk6u24";

const ERC721_GAS_LIMIT = 10_000_000n;
const ERC1155_GAS_LIMIT = 15_000_000n;

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();

  const networkInfo = await ethers.provider.getNetwork();

  if (networkInfo.chainId !== 11155111n) {
    throw new Error("This script must run on Sepolia.");
  }

  const feeData = await ethers.provider.getFeeData();

  if (
    feeData.maxFeePerGas === null ||
    feeData.maxPriorityFeePerGas === null
  ) {
    throw new Error("EIP-1559 gas fees unavailable.");
  }

  // Explicitly use Sepolia fee estimates instead of
  // Hardhat's default transaction fee.
  const fees = {
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  };

  console.log("Network: Sepolia");
  console.log("Deployer:", deployer.address);
  console.log("Student wallet:", STUDENT_WALLET);

  console.log(
    "Max fee:",
    ethers.formatUnits(fees.maxFeePerGas, "gwei"),
    "gwei"
  );

  console.log(
    "Priority fee:",
    ethers.formatUnits(fees.maxPriorityFeePerGas, "gwei"),
    "gwei"
  );

  const balance = await ethers.provider.getBalance(
    deployer.address
  );

  console.log(
    "Balance:",
    ethers.formatEther(balance),
    "ETH"
  );

  const minimumDeploymentReserve =
    (ERC721_GAS_LIMIT + ERC1155_GAS_LIMIT) *
    fees.maxFeePerGas;

  if (balance < minimumDeploymentReserve) {
    throw new Error(
      "Insufficient ETH for deployment gas reservation."
    );
  }

  const SoulboundFactory = await ethers.getContractFactory(
    "SoulboundVisitCardERC721"
  );

  const GameFactory = await ethers.getContractFactory(
    "GameCharacterCollectionERC1155"
  );

  // Check estimates before submitting transactions.
  const soulboundGas = await ethers.provider.estimateGas({
    ...(await SoulboundFactory.getDeployTransaction()),
    from: deployer.address,
  });

  const gameGas = await ethers.provider.estimateGas({
    ...(await GameFactory.getDeployTransaction()),
    from: deployer.address,
  });

  console.log("ERC721 gas estimate:", soulboundGas.toString());
  console.log("ERC1155 gas estimate:", gameGas.toString());

  if (soulboundGas > ERC721_GAS_LIMIT) {
    throw new Error("ERC721 gas limit is too low.");
  }

  if (gameGas > ERC1155_GAS_LIMIT) {
    throw new Error("ERC1155 gas limit is too low.");
  }

  console.log("\n1. Deploying ERC721...");

  const soulbound: any = await SoulboundFactory.deploy({
    gasLimit: ERC721_GAS_LIMIT,
    ...fees,
  });

  console.log(
    "ERC721 deployment TX:",
    soulbound.deploymentTransaction()?.hash
  );

  await soulbound.waitForDeployment();

  console.log(
    "ERC721 address:",
    await soulbound.getAddress()
  );

  console.log("\n2. Minting student card...");

  const cardTx = await soulbound.mintVisitCard(
    STUDENT_WALLET,
    "Sasha",
    "STU001",
    "Blockchain Development",
    STUDENT_METADATA,
    fees
  );

  await cardTx.wait();

  console.log("Student card TX:", cardTx.hash);

  console.log("\n3. Deploying ERC1155...");

  const game: any = await GameFactory.deploy({
    gasLimit: ERC1155_GAS_LIMIT,
    ...fees,
  });

  console.log(
    "ERC1155 deployment TX:",
    game.deploymentTransaction()?.hash
  );

  await game.waitForDeployment();

  console.log(
    "ERC1155 address:",
    await game.getAddress()
  );

  console.log("\n4. Initializing characters...");

  const initTx = await game.initializeCharacters(fees);
  await initTx.wait();

  console.log("Initialization TX:", initTx.hash);

  console.log("\n5. Setting metadata...");

  for (let id = 1; id <= 10; id++) {
    const metadataURI =
      `ipfs://${CHARACTERS_CID}/character-${id}.json`;

    const imageURI =
      `ipfs://${IMAGES_CID}/character-${id}.svg`;

    const tx = await game.setCharacterMetadata(
      id,
      metadataURI,
      imageURI,
      fees
    );

    await tx.wait();

    console.log(`Character ${id} metadata TX:`, tx.hash);
  }

  console.log("\n6. Batch minting 10 characters...");

  const mintTx = await game.mintCollection(fees);
  await mintTx.wait();

  console.log("Batch mint TX:", mintTx.hash);

  console.log("\n7. Batch transferring 2 characters...");

  const transferTx = await game.safeBatchTransferFrom(
    deployer.address,
    STUDENT_WALLET,
    [1, 2],
    [1, 1],
    "0x",
    fees
  );

  await transferTx.wait();

  console.log("Batch transfer TX:", transferTx.hash);

  console.log("\n8. Verifying balances...");

  console.log(
    "Soulbound balance:",
    (await soulbound.balanceOf(STUDENT_WALLET)).toString()
  );

  console.log(
    "Character #1:",
    (await game.balanceOf(STUDENT_WALLET, 1)).toString()
  );

  console.log(
    "Character #2:",
    (await game.balanceOf(STUDENT_WALLET, 2)).toString()
  );

  console.log("\nASSIGNMENT 9 COMPLETED!");
  console.log("ERC721:", await soulbound.getAddress());
  console.log("ERC1155:", await game.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
