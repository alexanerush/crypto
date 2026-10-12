
# Assignment 9 — NFT Standards: ERC-721 and ERC-1155

## 1. Overview

This project implements two NFT smart contracts using Solidity, Hardhat 3, TypeScript, Ethers.js, and OpenZeppelin Contracts.

The assignment demonstrates the implementation and practical use of two Ethereum token standards:

- **ERC-721:** A non-transferable (Soulbound) NFT representing a student's university visit card.
- **ERC-1155:** A collection of ten unique game characters supporting batch minting and batch transfers.

Both contracts were successfully deployed to the Ethereum Sepolia test network.

The project includes smart contract development, NFT metadata hosted on IPFS, automated testing, deployment scripts, and real blockchain transactions.

## 2. Research and Planning

### 2.1. ERC-721 Standard

ERC-721 is an Ethereum standard for non-fungible tokens (NFTs). Each token has a unique identifier and can represent an individual digital asset.

Typical applications include:

- Digital collectibles.
- Certificates and diplomas.
- Membership cards.
- Digital identities.
- Game assets.

In this assignment, ERC-721 is used to implement a student visit card.

Unlike traditional NFTs, the student card is designed as a **Soulbound Token (SBT)**, meaning it cannot be transferred between users after minting.

This makes the token suitable for representing personal credentials or identity-related assets.

Reference: https://eips.ethereum.org/EIPS/eip-721

### 2.2. ERC-1155 Standard

ERC-1155 is a multi-token standard that allows multiple token types to be managed within one smart contract.

It supports:

- Multiple token IDs.
- Different token balances.
- Batch minting.
- Batch transfers.
- Individual token metadata.
- Efficient management of game assets.

ERC-1155 is particularly suitable for gaming applications where a single collection may contain multiple characters, weapons, or other assets.

Reference: https://eips.ethereum.org/EIPS/eip-1155

### 2.3. Design Decisions

The project implements two independent smart contracts.

**SoulboundVisitCardERC721**

- Represents a student's university visit card.
- Uses the ERC-721 standard.
- Allows only the contract owner to mint cards.
- Stores student-related information.
- Uses metadata hosted on IPFS.
- Prevents transfers and approvals.

**GameCharacterCollectionERC1155**

- Represents ten different game characters.
- Uses the ERC-1155 standard.
- Assigns unique token IDs to characters.
- Stores character attributes and metadata.
- Supports batch minting.
- Supports batch transfers.
- Restricts administrative functions to the contract owner.

OpenZeppelin Contracts are used as the foundation for both implementations.

## 3. Technologies

- Solidity 0.8.26
- Hardhat 3
- TypeScript
- Ethers.js
- OpenZeppelin Contracts 5.6.1
- Mocha
- Chai
- Ethereum Virtual Machine (EVM)
- Sepolia Ethereum Test Network
- IPFS
- MetaMask

## 4. Project Structure

The main Assignment 9 files are:

```text
crypto/
├── contracts/
│   ├── SoulboundVisitCardERC721.sol
│   └── GameCharacterCollectionERC1155.sol
├── scripts/
│   ├── deploy-assignment-9.ts
│   └── check-gas.ts
├── test/
│   └── GameCharacterCollection.ts
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

The repository may also contain contracts, scripts, and tests from previous assignments.

## 5. ERC-721: Soulbound Student Visit Card

### 5.1. Purpose

The first smart contract implements a university student visit card as an ERC-721 NFT.

Each NFT represents an individual student's digital identity card.

The token contains student-related information and a reference to metadata stored on IPFS.

### 5.2. Soulbound Functionality

The student card is non-transferable.

After minting, the NFT remains assigned to the student's wallet.

The contract prevents:

- Transfers to other wallet addresses.
- Standard ERC-721 token approvals.
- Operator approvals.

This restriction is implemented at the smart contract level rather than relying on the user interface.

### 5.3. Access Control

The contract uses OpenZeppelin's Ownable functionality.

Only the contract owner is authorized to mint new student cards.

Unauthorized minting attempts are rejected.

### 5.4. Student Metadata

The NFT metadata is hosted on IPFS.

Metadata URI:

```text
ipfs://bafybeigdpf3qyuntgd352zilkupuvi4gc5nhynna3plsprep3qlx7kgq34/student-card.json
```

The deployed student card uses the following information:

| Property | Value |
|---|---|
| Student name | Sasha |
| Student ID | STU001 |
| Course | Blockchain Development |
| Token standard | ERC-721 |
| Token type | Soulbound NFT |
| Network | Sepolia |

The metadata contains descriptive information and references to the NFT's visual representation.

## 6. ERC-1155: Game Character Collection

### 6.1. Purpose

The second smart contract implements a collection of ten game characters using ERC-1155.

Each character is represented by a unique token ID and has individual metadata and attributes.

### 6.2. Character Collection

The collection contains the following characters:

| Token ID | Character |
|---|---|
| 1 | Shadow Knight |
| 2 | Frost Mage |
| 3 | Flame Archer |
| 4 | Forest Guardian |
| 5 | Storm Assassin |
| 6 | Iron Golem |
| 7 | Solar Priest |
| 8 | Void Hunter |
| 9 | Ocean Samurai |
| 10 | Crystal Dragon |

Each character has its own metadata JSON file and SVG image.

### 6.3. Character Initialization

The ten characters are initialized using the `initializeCharacters()` function.

Initialization is performed separately from contract deployment.

This approach reduces the gas required by the deployment transaction and allows the contract to be deployed within Sepolia transaction gas limits.

Character initialization can only be performed once.

### 6.4. Metadata and Attributes

Character metadata is hosted on IPFS.

Metadata directory:

```text
ipfs://bafybeif24alqmcuab7ctnjvgad36ukg6xsbejgzr4mw2gkvfrnwamqn5vu/
```

Image directory:

```text
ipfs://bafybeige66a4mzl6twou6xvr3dyt7mtharh6fql4du72vhlmxrhphk6u24/
```

Each character has a separate metadata file:

```text
character-1.json
character-2.json
character-3.json
character-4.json
character-5.json
character-6.json
character-7.json
character-8.json
character-9.json
character-10.json
```

Each character also has a corresponding SVG image.

The contract provides the `setCharacterMetadata()` function to associate a character ID with its metadata and image URIs.

### 6.5. Batch Minting

The ERC-1155 contract supports minting the game character collection.

The `mintCollection()` function was successfully executed on Sepolia.

The transaction created tokens for the collection.

### 6.6. Batch Transfers

ERC-1155 supports transferring multiple token types in one transaction using:

```solidity
safeBatchTransferFrom(
    from,
    to,
    ids,
    amounts,
    data
)
```

The deployment script demonstrates a batch transfer involving:

- Token ID 1.
- Token ID 2.
- One unit of each token.

For the recorded Sepolia demonstration, the sender and recipient were the same wallet address. Therefore, the transaction demonstrates a successful batch-transfer call, but it does not demonstrate moving tokens between two different owners.

## 7. Local Development

### 7.1. Install Dependencies

```bash
npm install
```

### 7.2. Compile Contracts

```bash
npx hardhat compile
```

### 7.3. Run Automated Tests

```bash
npx hardhat test
```

### 7.4. Deploy to Sepolia

The project includes the deployment script:

```text
scripts/deploy-assignment-9.ts
```

Run:

```bash
npx hardhat run scripts/deploy-assignment-9.ts --network sepolia
```

**Important:** This script creates new contract instances and submits real Sepolia transactions. It should not be rerun simply to inspect contracts that have already been deployed.

Sepolia ETH is required to pay transaction fees.

## 8. Automated Testing

The project uses Hardhat, Mocha, Chai, and Ethers.js for automated testing.

The tests cover the functionality of the smart contracts, including:

- Contract deployment.
- Owner authorization.
- Character initialization.
- Prevention of repeated initialization.
- Character metadata management.
- Minting operations.
- Batch minting.
- Batch transfers.
- Validation of token IDs.
- Rejection of unauthorized operations.
- ERC-721 Soulbound restrictions.

### Test Results

**Latest local test result: 37 passing tests.**

The complete test suite passed successfully before deployment to Sepolia.

Automated testing verifies expected behavior in the local development environment, but it does not replace a professional security audit.

## 9. Sepolia Deployment

Both NFT contracts were successfully deployed to the Ethereum Sepolia test network.

### 9.1. Network Information

| Property | Value |
|---|---|
| Network | Ethereum Sepolia |
| Chain ID | 11155111 |
| Deployment tool | Hardhat 3 |
| Wallet | MetaMask / Ethers.js |
| Deployment status | Successful |

Deployer address:

```text
0xB631f3a41bb22286bB1Ceb327726DdFe05BAA3f1
```

### 9.2. ERC-721 Deployment

Contract:

```text
SoulboundVisitCardERC721
```

Deployed address:

```text
0xf7ff51B71DDAD175066BF7C661Ff728eaA3aB784
```

Etherscan:

https://sepolia.etherscan.io/address/0xf7ff51B71DDAD175066BF7C661Ff728eaA3aB784

Deployment transaction:

https://sepolia.etherscan.io/tx/0x2e88fbcdf52181a673f1dccd434f08de9098965751aa98dc09107718f33ae11b

Student card mint transaction:

https://sepolia.etherscan.io/tx/0xc5d25f88824717d5fc9f50c6d61e1b7a4f80a6778577793396acd437fbbd8894

**Verified result from the deployment script:**

```text
Soulbound balance: 1
```

### 9.3. ERC-1155 Deployment

Contract:

```text
GameCharacterCollectionERC1155
```

Deployed address:

```text
0x9b62e5E54d28B6DbE19763549d2a6C8917F7FC42
```

Etherscan:

https://sepolia.etherscan.io/address/0x9b62e5E54d28B6DbE19763549d2a6C8917F7FC42

Deployment transaction:

https://sepolia.etherscan.io/tx/0x5e6402d4cdb271200ebdb6080aa05c841bb5d49b2d52b92803017b0ce22dc960

Character initialization transaction:

https://sepolia.etherscan.io/tx/0x035b1437a2c70aaf2e9c748f1e419bd7aba580fc18c736e265826bdb50ce3594

### 9.4. Metadata Transactions

All ten character metadata transactions completed successfully.

| Character | Transaction |
|---|---|
| 1 | [View](https://sepolia.etherscan.io/tx/0x5ebc8d6c3427c7eb6a7950db0735840904528e037d301d6bf36f914fe620e665) |
| 2 | [View](https://sepolia.etherscan.io/tx/0x010d2aff1f54be38e284732d2abd40eed1faedeb5a0f2ee60bc580bb77b1caae) |
| 3 | [View](https://sepolia.etherscan.io/tx/0x515712a2f9efa2392665615fa3a65e3989472785483f8a78595db110a834e80a) |
| 4 | [View](https://sepolia.etherscan.io/tx/0xc3dc04274f517e72e4ec2417211ae65c8b3044f01476c5d49573a057bf211010) |
| 5 | [View](https://sepolia.etherscan.io/tx/0x78282f029e4377070d4521fb07b729578e342460da8129f647b42ed9eefe55b4) |
| 6 | [View](https://sepolia.etherscan.io/tx/0x087a275c21baf97447004ea69306b892d8ccb4de634d1a213f0feca798cb56bd) |
| 7 | [View](https://sepolia.etherscan.io/tx/0xd5b0389e3338f20a3adc09abe5e831d870bd7b26e7a369c0196e17d629611633) |
| 8 | [View](https://sepolia.etherscan.io/tx/0x92e48bdec9346b40c64f931f16b76d4831806c9b2bf9c2e298fa14971a99e368) |
| 9 | [View](https://sepolia.etherscan.io/tx/0x0d009171103c3a2c7e16162ac9fc0a81695e9534ce2d1075c2618e9397b1d793) |
| 10 | [View](https://sepolia.etherscan.io/tx/0x268757195da27a54364966cc1eeeeaac981c31fee86925e0e696c5c1dc7c3c50) |

### 9.5. Batch Minting Transaction

All ten game characters were minted using the collection minting function.

Transaction:

https://sepolia.etherscan.io/tx/0xca236acc651940350572b49363773b827a5fb71d82b7bdd16e4a9166600e2731


### 9.6. Batch Transfer Transaction

The ERC-1155 contract successfully demonstrated batch transfer functionality on the Ethereum Sepolia test network.

#### Initial Batch Transfer

The first batch transfer was executed between the same sender and recipient wallet as part of the deployment process.

Transaction:

https://sepolia.etherscan.io/tx/0x30c55164fc8f7c92d3dd7d52237f9385c4bdd9bd795dac443e280db1490953dd

This transaction confirmed that the batch transfer function could execute successfully.

#### Final Batch Transfer to Student Wallet

A second batch transfer was successfully executed to demonstrate transferring NFTs between two different Ethereum wallets, as required by the assignment.

**Transferred NFTs:**

- Character #1 — Shadow Knight: 1 NFT
- Character #2 — Frost Mage: 1 NFT
- Total transferred: 2 NFTs
- Transfer method: `safeBatchTransferFrom()`
- Network: Ethereum Sepolia
- Transaction status: Confirmed

**Sender (Contract Owner):**

`0xB631f3a41bb22286bB1Ceb327726DdFe05BAA3f1`

**Recipient (Student Wallet):**

`0xf6a583b7fF0dc7682BCFA48016571e03d3b214d1`

**Successful Batch Transfer Transaction:**

https://sepolia.etherscan.io/tx/0xb8f538b7ce1e201aef34ceb79d94f52a14de4089c242b26dfedd840880d91f52

The transaction was successfully confirmed on the Sepolia blockchain.

Both NFTs were transferred in a single transaction, demonstrating the efficiency of the ERC-1155 batch transfer mechanism.

### 9.7. Final Verification

The deployment and subsequent NFT transfer operations were completed successfully.

**ERC-721 Soulbound Student Visit Card:**

- Contract successfully deployed to Sepolia.
- One student visit card NFT minted.
- Soulbound transfer and approval restrictions implemented.
- Student metadata stored on IPFS.

**ERC-1155 Game Character Collection:**

- Contract successfully deployed to Sepolia.
- Ten distinct game characters initialized.
- Unique metadata and images assigned to each character.
- Ten NFTs minted, one per character ID.
- Batch minting functionality demonstrated.
- Batch transfer to a separate student wallet completed successfully.

**Verified NFT Balances After Final Transfer:**

| Wallet | NFT | Balance |
|---|---|---|
| Original student/deployer wallet | ERC-721 Student Visit Card | 1 |
| Recipient student wallet | ERC-1155 Character #1 | 1 |
| Recipient student wallet | ERC-1155 Character #2 | 1 |

**Deployed Contract Addresses:**

ERC-721 Soulbound Student Visit Card:

`0xf7ff51B71DDAD175066BF7C661Ff728eaA3aB784`

ERC-1155 Game Character Collection:

`0x9b62e5E54d28B6DbE19763549d2a6C8917F7FC42`

**Final Transfer Verification:**

Transaction hash:

`0xb8f538b7ce1e201aef34ceb79d94f52a14de4089c242b26dfedd840880d91f52`

The transfer script confirmed:

```text
Network: Sepolia
Transferring characters #1 and #2...
Transaction confirmed!
Recipient character #1: 1
Recipient character #2: 1
ASSIGNMENT 9 BATCH TRANSFER COMPLETED!
```

**Automated Testing:**

37 tests passed successfully in the local Hardhat environment.

**Final Result:**

Both NFT smart contracts were successfully implemented and deployed to Sepolia. The project demonstrates ERC-721 Soulbound functionality, ERC-1155 character collection management, IPFS metadata integration, access control, batch minting, and successful batch transfers between separate wallets.

The required blockchain transactions are documented and publicly verifiable through Sepolia Etherscan.


## 10. Security Considerations

### 10.1. Owner Authorization

Administrative operations are restricted to the contract owner.

This prevents unauthorized users from minting student cards or modifying protected character data.

### 10.2. Soulbound Restrictions

The ERC-721 implementation prevents transfers and approvals.

This ensures that a student visit card cannot be freely traded like a conventional NFT.

### 10.3. Initialization Protection

The ERC-1155 character collection can only be initialized once.

This prevents repeated initialization of the same character data.

### 10.4. Token Validation

The ERC-1155 contract validates character IDs and initialization status before performing relevant operations.

### 10.5. IPFS Metadata

NFT metadata and images are stored on IPFS.

IPFS content identifiers provide content-addressed references to the uploaded files.

### 10.6. Limitations

- The contracts are educational implementations.
- The project has not undergone a professional security audit.
- The ERC-721 card cannot be transferred after minting.
- Administrative permissions depend on the security of the owner's wallet.
- The recorded ERC-1155 batch transfer used the same sender and recipient address.
- Automated tests cannot guarantee the absence of vulnerabilities.

## 11. Conclusion

Assignment 9 demonstrates the development and deployment of NFT smart contracts using ERC-721 and ERC-1155.

The first contract implements a non-transferable student visit card using the Soulbound NFT concept.

The second contract implements a collection of ten game characters with individual metadata, character attributes, batch minting, and batch-transfer functionality.

Both contracts were successfully deployed to the Ethereum Sepolia test network.

NFT metadata and images were uploaded to IPFS, and the deployment process included character initialization, metadata configuration, minting, and batch-transfer transactions.

The complete local test suite passed **37 automated tests**.

The project demonstrates practical experience with Ethereum NFT standards, Solidity smart contracts, OpenZeppelin, Hardhat, Ethers.js, IPFS, and public testnet deployment.
