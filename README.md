# Assignment 3 — Ethereum Blockchain Fundamentals

**Network:** Ethereum Sepolia Testnet  
**Tools:** MetaMask, ETH.Build, Chainlist, Google Cloud Web3 Faucet, Sepolia Etherscan

---

## 1. Wallet

MetaMask was installed and configured to create and manage Ethereum accounts.

The ETH.Build visual environment was used to explore the process of generating an Ethereum address from a mnemonic phrase, including private and public key derivation.

**MetaMask Account 1:**

`0xB631f3a41bb22286bB1Ceb327726DdFe05BAA3f1`

**MetaMask Account 2:**

`0xf6a583b7fF0dc7682BCFA48016571e03d3b214d1`

For security reasons, mnemonic phrases and private keys are not published.

---

## 2. Chains

Ethereum was selected as the main blockchain, and Sepolia was used as the test network.

Sepolia was configured in MetaMask. Test ETH was obtained through Google Cloud Web3 Faucet.

**Incoming transaction:**

https://sepolia.etherscan.io/tx/0xfd71997c5a6ed6ea108d29c46011fac86e08bf168eb06f3c0f360083a1f2c5c2

**Amount received:** 0.05 Sepolia ETH  
**Status:** Success

The transaction was verified using Sepolia Etherscan.

---

## 3. Transactions

A second MetaMask account was created to test transfers between Ethereum addresses.

**Sender:** Account 1  
**Receiver:** Account 2  
**Amount:** 0.005 Sepolia ETH  
**Status:** Success

**Transaction link:**

https://sepolia.etherscan.io/tx/0xdef3abc4ae451bba1640eddd5150eddc96c7b55a8f8e097ca16a8b0776f134cf

The transaction details were reviewed in MetaMask and Sepolia Etherscan.

The following parameters were examined:

- Transaction Hash
- From and To addresses
- Transaction Value
- Gas Price
- Gas Limit
- Gas Used
- Transaction Fee
- Transaction Status

Both interfaces provided information about the same blockchain transaction.

---

## 4. Gas

The purpose of this experiment was to investigate how gas settings affect Ethereum transaction fees.

MetaMask provides different fee options: Low, Market, Aggressive, and Advanced.

### Experiment 1 — Zero Gas Fees

An attempt was made to set the gas fees to zero using the Advanced settings.

MetaMask rejected these values and displayed validation errors:

- Max base fee must be greater than 0.
- Priority fee must be greater than 0.

Therefore, the transaction could not be submitted with zero fees.

### Experiment 2 — Low Gas Price

A transaction of 0.0001 Sepolia ETH was performed with a reduced priority fee.

**Results:**

- Gas Price: 0.100000012 Gwei
- Gas Limit: 31,500
- Gas Used: 21,000
- Transaction Fee: 0.000002100000252 ETH
- Status: Success

**Transaction link:**

https://sepolia.etherscan.io/tx/0x78503df9e2532b1b1c3ebe36647f543556bb87b2067a5e18fc7ca7dbe475e88b

### Experiment 3 — Higher Gas Price

Another transaction of 0.0001 Sepolia ETH was performed using a higher priority fee.

**Results:**

- Gas Price: 1.500000012 Gwei
- Gas Limit: 31,500
- Gas Used: 21,000
- Transaction Fee: 0.000031500000252 ETH
- Status: Success

### Gas Fee Comparison

| Parameter | Low Gas Price | Higher Gas Price |
|---|---|---|
| Transfer Amount | 0.0001 ETH | 0.0001 ETH |
| Gas Price | 0.100000012 Gwei | 1.500000012 Gwei |
| Gas Limit | 31,500 | 31,500 |
| Gas Used | 21,000 | 21,000 |
| Transaction Fee | 0.000002100000252 ETH | 0.000031500000252 ETH |
| Status | Success | Success |

**Formula:**

Transaction Fee = Gas Used × Gas Price

The transaction with the higher gas price required approximately 15 times more ETH in transaction fees.

However, the gas usage remained unchanged at 21,000 units.

This demonstrates that gas price directly affects the transaction fee, while gas usage depends on the operation being executed.

Both transactions were successfully confirmed.

### Gas Trackers

**Ethereum Mainnet Gas Tracker:**

https://etherscan.io/gastracker

**Sepolia Blockchain Explorer:**

https://sepolia.etherscan.io/

---

## 5. Nonce

Nonce is a sequential number assigned to transactions sent from an Ethereum account.

It ensures that transactions from the same account are processed in the correct order and helps prevent transaction replay.

During transaction analysis, nonce values were inspected using Sepolia Etherscan.

**Observed results:**

- Account 2 transaction: Nonce 0
- Account 1 transaction: Nonce 1

Both transactions were successfully confirmed.

The experiment involving a deliberately skipped nonce and two dependent pending transactions has not yet been completed. The required transaction links and MetaMask Activity Log screenshots therefore remain outstanding.

---

## Conclusion

During Assignment 3, the fundamental concepts of Ethereum blockchain technology were explored.

The practical work included:

- Creating and managing Ethereum accounts using MetaMask.
- Exploring cryptographic key and address generation using ETH.Build.
- Configuring the Sepolia Testnet.
- Receiving test ETH from a faucet.
- Transferring ETH between two accounts.
- Inspecting blockchain transactions using Sepolia Etherscan.
- Experimenting with different gas prices.
- Analyzing transaction fees and nonce values.

The experiments demonstrated how blockchain transactions are created, validated, and recorded, as well as how network fees are calculated.

All transactions were performed using test ETH on the Ethereum Sepolia Testnet.

**Remaining assignment requirements:** verification of account restoration after reinstalling MetaMask, the nonce-gap experiment with two transaction links and Activity Log screenshots, and the higher-gas-price transaction link.
