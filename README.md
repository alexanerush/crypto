# Assignment 7 — Upgradeable ERC-20 Token

## 1. Overview

This project implements an upgradeable ERC-20 token using Solidity, OpenZeppelin Contracts, and Hardhat 3.

The main objective is to demonstrate how a UUPS upgradeable smart contract works with an ERC-1967 proxy and how its implementation can be upgraded from V1 to V2 without changing the proxy address or losing token balances.

The project includes smart contract development, local deployment, token transfers, automated testing, and deployment to the Ethereum Sepolia test network.

## 2. Technologies

- Solidity 0.8.24
- Hardhat 3
- TypeScript
- Ethers.js
- OpenZeppelin Contracts
- ERC-20
- UUPS upgradeability pattern
- ERC-1967 Proxy
- Mocha and Chai

## 3. Project Structure

```text
Assignment-7/
├── contracts/
│   ├── MyTokenV1.sol
│   ├── MyTokenV2.sol
│   └── MyTokenProxy.sol
├── scripts/
│   ├── deploy.ts
│   ├── transfer.ts
│   ├── upgrade.ts
│   └── verify-upgrade.ts
├── test/
│   └── UpgradeableToken.ts
├── screenshots/
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 4. Smart Contracts

### MyTokenV1.sol

The first implementation provides ERC-20 token functionality.

Features:

- Token name: `MyToken`
- Token symbol: `MTK`
- Initial supply: 1,000,000 MTK
- 18 decimal places
- Token transfers
- Owner-restricted minting
- UUPS upgrade authorization restricted to the owner

The `initialize()` function initializes the token when the implementation is accessed through the proxy.

### MyTokenV2.sol

V2 inherits the functionality of V1 and introduces a `version()` function that returns `"V2"`.

The upgrade demonstrates how new functionality can be introduced without changing the proxy address or losing existing token balances.

### MyTokenProxy.sol

The proxy inherits OpenZeppelin's `ERC1967Proxy`.

It delegates calls to the current implementation and keeps the token state at the proxy address. The implementation can be changed through the UUPS upgrade mechanism.

## 5. Local Development

### Compile the contracts

```bash
npx hardhat compile
```

### Run automated tests

```bash
npx hardhat test
```

### Start a local blockchain

In the first terminal:

```bash
npx hardhat node
```

Keep this terminal running while using the local network.

### Deploy V1 and the proxy locally

In a second terminal:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Transfer tokens locally

```bash
npx hardhat run scripts/transfer.ts --network localhost
```

### Upgrade to V2 locally

```bash
npx hardhat run scripts/upgrade.ts --network localhost
```

### Verify the local upgrade

```bash
npx hardhat run scripts/verify-upgrade.ts --network localhost
```

## 6. Automated Tests

Automated tests are implemented in `test/UpgradeableToken.ts`.

The test suite covers:

1. Assignment of the initial token supply to the owner.
2. Transfers between accounts.
3. Owner-authorized token minting.
4. Rejection of minting attempts by non-owners.
5. Upgrading from V1 to V2 while preserving balances and total supply.

All five Mocha tests passed in the local development environment.

## 7. Sepolia Deployment

The contracts were deployed and tested on the Ethereum Sepolia test network.

### Contract Addresses

| Contract | Address |
|---|---|
| V1 implementation | `0x93b3177c03D91FF0bD79bA2fDAf04f2f05A331Ff` |
| Proxy | `0xa92681dC1B3FD9E125e9c9c42304a568532189C5` |
| V2 implementation | `0x8f25C7E95b65ad16A37B9C0346aD368980d2ee39` |

### Etherscan Links

- [V1 implementation](https://sepolia.etherscan.io/address/0x93b3177c03D91FF0bD79bA2fFDAf04f2f05A331Ff)
- [Proxy contract](https://sepolia.etherscan.io/address/0xa92681dC1B3FD9E125e9c9c42304a568532189C5)
- [V2 implementation](https://sepolia.etherscan.io/address/0x8f25C7E95b65ad16A37B9C0346aD368980d2ee39)
- [Token transfer transaction](https://sepolia.etherscan.io/tx/0xf6c9cc79a2bf2ac16dbc10c982445e2db32737dfc9426a0486cc893f6a5ef71a)
- [Upgrade transaction](https://sepolia.etherscan.io/tx/0xf7dfdc76e41f1400c1619e616f95c111bbb2940de70dea4d8d057911101bf61b)

## 8. Sepolia Verification Results

The deployment and upgrade scripts completed successfully.

| Property | Result |
|---|---|
| Token name | MyToken |
| Token symbol | MTK |
| Initial total supply | 1,000,000 MTK |
| Transfer amount | 100 MTK |
| Owner balance after transfer | 999,900 MTK |
| Recipient balance after transfer | 100 MTK |
| Version after upgrade | V2 |
| Total supply after upgrade | 1,000,000 MTK |
| Owner balance after upgrade | 999,900 MTK |
| Recipient balance after upgrade | 100 MTK |
| Proxy address preserved | Yes |

The verification script confirmed that the proxy exposes the V2 implementation and that the token balances and total supply were preserved.

## 9. Conclusion

This assignment demonstrates the development, deployment, and testing of an upgradeable ERC-20 token using the UUPS upgradeability pattern.

The V1 implementation was deployed behind an ERC-1967 proxy. A transfer of 100 MTK was completed on Sepolia, after which the proxy was upgraded to V2.

The upgrade preserved the proxy address, token balances, and total supply. The new `version()` function returned `"V2"`.

The project includes deployment, transfer, upgrade, and verification scripts, together with automated tests for the main token functionality.