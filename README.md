# Assignment 8 — Multi-Signature Wallet

## 1. Overview

This project implements a multi-signature (multisig) wallet using Solidity, Hardhat 3, TypeScript, and Ethers.js.

A multisignature wallet requires approval from multiple authorized owners before a transaction can be executed. This reduces reliance on a single account and provides additional protection for shared funds, decentralized finance (DeFi), and blockchain governance.

The wallet supports multiple owners, a configurable confirmation threshold, transaction submission, confirmation, confirmation revocation, and execution of Ether transfers after the required approvals have been collected.

The project includes smart contract implementation, automated testing, deployment, interaction instructions, and security analysis.

## 2. Research and Planning

### 2.1. Multi-Signature Wallets in DeFi and Governance

A multi-signature wallet is a smart contract wallet controlled by multiple authorized owners. Instead of allowing one account to execute every transaction independently, the wallet requires a predefined number of distinct owner approvals.

Multisig wallets can be used for:

- Managing shared funds and project treasuries.
- Protecting organizational and DAO assets.
- Requiring multiple approvals for administrative operations.
- Reducing the risks associated with a compromised individual account.

A confirmation threshold determines how many owners must approve a transaction. For example, a wallet with three owners and a threshold of two requires at least two distinct owners to confirm a transaction before execution.

### 2.2. Review of Existing Solutions

**Safe Smart Account (formerly Gnosis Safe)**

Safe is an established smart account solution with multisignature functionality. Its architecture uses a list of owners and a configurable threshold of required confirmations. It also supports more advanced features, including owner management, modules, and flexible transaction execution.

This project adopts the fundamental owner-based authorization and threshold-approval principles, while implementing a smaller and simpler feature set.

Documentation: https://docs.safe.global/advanced/smart-account-overview

**Gnosis MultiSigWallet**

The original Gnosis MultiSigWallet repository provides an open-source example of a wallet in which multiple parties must approve transactions before execution. Its implementation includes transaction submission, confirmation, revocation, execution, owner validation, and event logging.

The repository is archived and has been superseded by newer Safe implementations. It remains a useful reference for understanding the basic multisignature transaction lifecycle.

Source code: https://github.com/gnosis/MultiSigWallet

**ConsenSys MultiSigWallet**

The ConsenSysMesh MultiSigWallet repository provides an additional reference implementation of an Ethereum multisignature wallet, including a version with a daily spending limit.

Source code: https://github.com/ConsenSysMesh/MultiSigWallet

### 2.3. Design Decisions

Based on these common multisignature patterns, this project implements:

- A fixed list of owners defined during deployment.
- A configurable minimum confirmation threshold.
- Separate transaction submission, confirmation, revocation, and execution stages.
- Access control restricting wallet operations to authorized owners.
- Event logging for important wallet operations.
- Validation of owner addresses and confirmation thresholds.

The implementation focuses on the core multisignature mechanism rather than reproducing the advanced functionality of production wallets.

## 3. Technologies

- Solidity 0.8.24
- Hardhat 3
- TypeScript
- Ethers.js
- Mocha
- Chai
- Ethereum Virtual Machine (EVM)

## 4. Project Structure

```text
crypto/
├── contracts/
│   ├── MultiSigWallet.sol
│   ├── MyTokenProxy.sol
│   ├── MyTokenV1.sol
│   └── MyTokenV2.sol
├── scripts/
│   ├── deploy-multisig.ts
│   ├── deploy.ts
│   ├── transfer.ts
│   ├── upgrade.ts
│   └── verify-upgrade.ts
├── test/
│   ├── MultiSigWallet.ts
│   └── UpgradeableToken.ts
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

`MultiSigWallet.sol`, `MultiSigWallet.ts`, and `deploy-multisig.ts` implement the main functionality for Assignment 8. The existing token contracts, scripts, and tests are retained from Assignment 7.

## 5. Smart Contract Design

### 5.1. Owners and Access Control

The contract stores owner addresses in an array and uses a mapping to determine whether an address is an authorized owner.

The constructor validates that:

- At least one owner is provided.
- No owner address is the zero address.
- Owner addresses are unique.
- The confirmation threshold is greater than zero.
- The threshold does not exceed the number of owners.

The `onlyOwner` modifier restricts transaction submission, confirmation, revocation, and execution to authorized owners.

### 5.2. Transaction Data

Each transaction stores:

- Recipient address.
- Ether value.
- Transaction data.
- Execution status.
- Number of confirmations.

A separate mapping records whether each owner has confirmed a particular transaction. This prevents the same owner from confirming a transaction multiple times.

### 5.3. Transaction Lifecycle

1. **Submission:** An owner proposes a transaction by specifying the recipient, Ether amount, and transaction data.
2. **Confirmation:** Authorized owners independently confirm the proposed transaction.
3. **Revocation:** An owner can revoke their confirmation before execution.
4. **Execution:** An authorized owner can execute the transaction once the required confirmation threshold has been reached.

A transaction cannot be executed before the threshold is reached or more than once.

### 5.4. Main Functions

| Function | Description |
|---|---|
| `submitTransaction()` | Creates a transaction proposal. |
| `confirmTransaction()` | Records an owner's confirmation. |
| `revokeConfirmation()` | Removes an owner's confirmation before execution. |
| `executeTransaction()` | Executes an approved transaction. |
| `getOwners()` | Returns the list of owners. |
| `getTransactionCount()` | Returns the number of submitted transactions. |
| `getTransaction()` | Returns the details of a transaction. |

The public `owners`, `isOwner`, `requiredConfirmations`, `transactions`, and `isConfirmed` state variables provide access to relevant wallet information.

The wallet accepts Ether through its `receive()` function.

## 6. Events

The contract emits events to record important operations:

- `Deposit` — Ether received by the wallet.
- `SubmitTransaction` — a transaction was submitted.
- `ConfirmTransaction` — an owner confirmed a transaction.
- `RevokeConfirmation` — an owner revoked a confirmation.
- `ExecuteTransaction` — a transaction was executed successfully.

Events provide an auditable record of wallet activity and can be monitored by blockchain applications and development tools.

## 7. Local Development

### 7.1. Install Dependencies

```bash
npm install
```

### 7.2. Compile the Contracts

```bash
npx hardhat compile
```

### 7.3. Run Automated Tests

```bash
npx hardhat test
```

The tests run in the local Hardhat development environment and do not require Ether on a public network.

## 8. Automated Testing

The multisignature wallet tests are implemented in `test/MultiSigWallet.ts`.

The test suite covers:

1. Initialization of owners and the confirmation threshold.
2. Rejection of duplicate owners.
3. Submission of a transaction by an owner.
4. Execution only after the required confirmations.
5. Revocation of a confirmation.
6. Rejection of duplicate confirmations.
7. Rejection of actions by non-owners.
8. Rejection of nonexistent transactions.
9. Rejection of a zero confirmation threshold.
10. Rejection of a threshold greater than the number of owners.
11. Rejection of the zero address as an owner.
12. Rejection of revoking a confirmation that was never given.
13. Rejection of execution when the wallet has insufficient funds.
14. Rejection of an empty owners list.
15. Verification of confirmation and revocation events.
16. Rejection of repeated execution of a transaction.
17. Verification that revoking one owner's confirmation preserves other owners' confirmations.

The existing `test/UpgradeableToken.ts` suite is also executed by the project test command.

**Latest local test result: 22 passing tests.**

- MultiSigWallet: 17 tests.
- Upgradeable MyToken: 5 tests.
- Total: 22 tests.

## 9. Deployment and Interaction

### 9.1. Deployment Parameters

The wallet constructor accepts two parameters:

- `_owners` — an array of authorized owner addresses.
- `_requiredConfirmations` — the minimum number of owner confirmations required for execution.

The deployment script configures three local development accounts as owners and sets the confirmation threshold to two.

### 9.2. Deployment Script

The deployment script is implemented in `scripts/deploy-multisig.ts`.

It deploys the `MultiSigWallet` contract using the configured Hardhat environment and prints:

- The deployed contract address.
- The addresses of the three owners.
- The required confirmation threshold.

Run the script from the project root:

```bash
npx hardhat run scripts/deploy-multisig.ts
```

The deployment script was executed successfully in the local development environment.

**Local deployment result:**

| Property | Result |
|---|---|
| Contract | MultiSigWallet |
| Network | Local Hardhat network |
| Owner count | 3 |
| Required confirmations | 2 |
| Contract address | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |

The displayed address belongs to the local Hardhat network. It is not a public Ethereum or Sepolia deployment address.

### 9.3. Interacting with the Wallet

An authorized owner can submit a transaction:

```typescript
await wallet.submitTransaction(
  recipientAddress,
  ethers.parseEther("1"),
  "0x"
);
```

Owners can confirm the transaction using its index:

```typescript
await wallet.confirmTransaction(0);
```

An owner can revoke their confirmation before execution:

```typescript
await wallet.revokeConfirmation(0);
```

Once the required confirmation threshold has been reached, an owner can execute the transaction:

```typescript
await wallet.executeTransaction(0);
```

These examples illustrate the interaction sequence. Every operation must be sent by an authorized owner, and the wallet must have sufficient Ether to complete a transfer.

## 10. Security Considerations

### 10.1. Owner Validation

The constructor rejects an empty owner list, duplicate addresses, zero addresses, and invalid confirmation thresholds.

### 10.2. Authorization

Only registered owners can submit, confirm, revoke, or execute transactions. Unauthorized calls revert.

### 10.3. Confirmation Integrity

Each owner can confirm a transaction only once. Revocation updates the confirmation mapping and count, preserving confirmations belonging to other owners.

### 10.4. Execution Threshold

Transactions cannot be executed until the configured confirmation threshold is reached.

### 10.5. Checks-Effects-Interactions

The execution function marks a transaction as executed before making the external call. If the call fails, the transaction reverts, including the execution-status change.

This follows the checks-effects-interactions pattern and helps prevent repeated execution of the same transaction during an external call.

### 10.6. Failed Execution

If the wallet has insufficient Ether or the external call fails, execution reverts. The transaction is not left marked as successfully executed.

### 10.7. Limitations

- Owners cannot be added or removed after deployment.
- The contract does not implement ERC-20 token transfers.
- There is no transaction cancellation mechanism after submission.
- The implementation has not undergone a professional security audit.
- Automated tests cannot guarantee the absence of vulnerabilities.
- The implementation does not include the advanced features of production multisig wallets, such as Safe modules or flexible owner management.

This contract is an educational implementation and should not be treated as a production-ready wallet without further review and auditing.

## 11. Conclusion

This assignment demonstrates the implementation and testing of a multi-signature wallet using Solidity and Hardhat 3.

The wallet requires approval from multiple authorized owners before executing Ether transfers. It supports transaction submission, confirmation, revocation, execution, event logging, and access control.

The deployment script was successfully executed on the local Hardhat network with three owners and a confirmation threshold of two.

The complete project test suite passed 22 tests in the local development environment, covering the primary transaction lifecycle, authorization rules, invalid initialization parameters, failed execution, and additional edge cases.

The project demonstrates how multisignature authorization can reduce dependence on a single account and improve control over shared blockchain funds.