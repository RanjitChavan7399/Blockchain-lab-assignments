# Assignment 3: Web Interface + MetaMask

## ChainTrade — Blockchain Product Transactions

---

## 📌 Project Overview

ChainTrade is a Web3 application that enables secure product transactions using blockchain technology. It integrates a React-based frontend with an Ethereum smart contract deployed using Hardhat.

The application allows users to:

* Connect their MetaMask wallet
* Interact with a deployed smart contract
* Execute blockchain transactions securely

---

## 🏗️ Project Structure

```
chaintrade/
├── contracts/
│   └── ProductTransaction.sol   ← Smart contract
├── scripts/
│   └── deploy.js                ← Deployment script
├── src/
│   ├── config.js                ← Environment configuration
│   ├── contractABI.js           ← Smart contract ABI
│   ├── App.jsx                  ← Main frontend UI
│   └── main.jsx                 ← Entry point
├── index.html                   ← Web entry file
├── hardhat.config.ts            ← Hardhat configuration
├── vite.config.js               ← Vite configuration
├── .env                         ← Environment variables
├── README.md                    ← Documentation
└── package.json
```

---

## 🔗 How Frontend Connects to Blockchain

The frontend connects to the blockchain using **MetaMask** and the Ethereum provider injected into the browser:

* `window.ethereum` is used to access the blockchain
* The contract ABI and address are used to interact with the deployed smart contract
* Configuration is handled via `config.js`

### Flow:

1. User opens the web app
2. MetaMask injects Ethereum provider
3. Frontend requests wallet access
4. Smart contract functions are called using ABI + contract address

---

## 🦊 How MetaMask is Used

MetaMask acts as a bridge between the frontend and blockchain:

* Connects user wallet to the application
* Signs transactions securely
* Allows interaction with Ethereum test network (Sepolia)

### Key Features:

* Wallet authentication
* Transaction approval popup
* Secure private key handling

---

## ⚙️ Features Implemented

✔ Connect MetaMask Wallet
✔ Display User Account Address
✔ Deploy Smart Contract (Hardhat)
✔ Interact with Smart Contract
✔ Execute Blockchain Transactions

---

## 🚀 Setup & Execution

### 1. Install Dependencies

```
npm install
```

### 2. Configure Environment Variables

Fill `.env` file:

```
DEPLOYER_PRIVATE_KEY=your_private_key
VITE_RPC_URL=your_rpc_url
VITE_CONTRACT_ADDRESS=deployed_contract_address
```

---

### 3. Compile Smart Contract

```
npx hardhat compile
```

---

### 4. Deploy Smart Contract

```
npm run deploy:sepolia
```

---

### 5. Run Frontend

```
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

---

## 📚 Technologies Used

* React (Frontend)
* Vite (Build Tool)
* Hardhat (Smart Contract Development)
* Solidity (Smart Contracts)
* MetaMask (Wallet Integration)
* Ethereum Sepolia Testnet

---

## ✅ Conclusion

This project demonstrates how a web interface can interact with blockchain using MetaMask, enabling secure and decentralized transactions.

---
