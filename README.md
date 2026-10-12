# Assignment 5 — Hardhat and Smart Contract Deployment

## 1. Objective

The objective of this assignment is to set up a Hardhat development environment, compile and test Solidity smart contracts, deploy contracts to the Ethereum Sepolia test network, and interact with a deployed smart contract.

## 2. Development Environment

The following tools and technologies were used:

- **Solidity** — smart contract programming language.
- **Hardhat 3** — Ethereum development framework.
- **TypeScript** — deployment scripts and tests.
- **Ethers.js** — interaction with the Ethereum blockchain.
- **MetaMask** — wallet for testnet transactions.
- **Alchemy** — Sepolia RPC provider.
- **Sepolia Etherscan** — verification of blockchain transactions.
- **Visual Studio Code** — development environment.

## 3. Project Setup

A Node.js project was initialized, and Hardhat was installed and configured with TypeScript, Mocha, and Ethers.js.

The project was compiled using:

```bash
npx hardhat compile
```

The tests were executed using:

```bash
npx hardhat test
```

**Test result:** 5 tests passed successfully.

## 4. Task 1 — Deploying the Lock Contract

A Solidity smart contract named `Lock.sol` was created.

The contract stores an unlock time and an owner address. Its `withdraw()` function allows the owner to withdraw the stored Ether after the unlock time.

A TypeScript deployment script, `scripts/deploy-lock.ts`, was used to deploy the contract to the Sepolia test network.

**Deployment result:** Successful.

**Contract address:**

`0xB9a670B5740f362Fb339B037Fe5357aFc439Ad7D`

**Deployment transaction:**

https://sepolia.etherscan.io/tx/0xae25f90d1633d9a288c19bcebd9376c85454a7dde6cca05978eacb839131647f

## 5. Task 2 — Creating and Deploying a Greeting Contract

A second Solidity smart contract named `Greeting.sol` was created.

The contract accepts a name as a constructor argument and stores it in a private state variable.

It provides a public `greet()` function that returns a personalized greeting.

The contract was deployed using `scripts/deploy-greeting.ts` with the constructor argument:

```text
Sasha
```

After deployment, the `greet()` function was called.

**Function output:**

```text
Hello, Sasha!
```

**Deployment result:** Successful.

**Contract address:**

`0x5974D18e224BB0540bfFABb01364Af62Cc39B08C`

**Deployment transaction:**

https://sepolia.etherscan.io/tx/0x612b05031ab3e3d240a26e29c7e5da34ccebc32fabed8ef3b3da09668efeb0a3

## 6. Project Structure

```text
contracts/
  Counter.sol
  Greeting.sol
  Lock.sol

scripts/
  deploy-greeting.ts
  deploy-lock.ts

test/
  Counter.ts

hardhat.config.ts
package.json
package-lock.json
tsconfig.json
README.md
```

The project also includes Hardhat-generated example files and configuration files.

## 7. Running the Project

Install dependencies:

```bash
npm install
```

Compile the contracts:

```bash
npx hardhat compile
```

Run the tests:

```bash
npx hardhat test
```

To deploy contracts to Sepolia, configure the required RPC URL and wallet private key securely using Hardhat's configuration variables.

Deploy the Lock contract:

```bash
npx hardhat run scripts/deploy-lock.ts --network sepolia
```

Deploy the Greeting contract:

```bash
npx hardhat run scripts/deploy-greeting.ts --network sepolia
```

A funded Sepolia testnet wallet is required for deployment.

## 8. Conclusion

Both assignment tasks were completed successfully.

The Hardhat development environment was configured, Solidity contracts were compiled, and all five existing tests passed.

The `Lock` and `Greeting` contracts were successfully deployed to the Ethereum Sepolia test network. The `greet()` function was called successfully and returned `Hello, Sasha!`.

Both deployment transactions can be inspected using the Sepolia Etherscan links provided above.