# Blockchain-lab-assignments
123B1B103-Blockchain Lab Assignments including smart contract development, Polygon deployment, Web3 integration with MetaMask, IPFS storage, and DAO implementation.


# 📘 Blockchain Assignments – Root README

## 👨‍🎓 Student Details

* **Name:** Ranjit Chavan
* **Roll Number:** 123B1B103
* **Course Name:** Blockchain Technology

---

## 📌 Overview of Assignments

### 🔹 Assignment 1: Certificate Verification Smart Contract

* A smart contract to store and verify student certificates on blockchain
* Ensures tamper-proof and secure academic records
* Features:

  * Add certificate (admin only)
  * Verify certificate using ID
* Uses mapping and struct for data storage 

---

### 🔹 Assignment 2: Polygon Deployment

* Deploy smart contract on Polygon Mumbai Testnet using Hardhat
* Features:

  * Compile and deploy contract
  * Verify transaction on Polygon explorer
* Includes network configuration and deployment steps 

---

### 🔹 Assignment 3: Web Interface + MetaMask (ChainTrade)

* Web3 application with React frontend and smart contract integration
* Features:

  * Connect MetaMask wallet
  * Execute blockchain transactions
  * Interact with deployed contract
* Uses Ethereum Sepolia testnet 

---

### 🔹 Assignment 4: IPFS Integration

* Upload and retrieve files using IPFS (Pinata)
* Features:

  * File upload to IPFS
  * Generate CID
  * Retrieve files via gateway
* Uses backend for secure API handling 

---

### 🔹 Assignment 5: DAO Smart Contract

* Implementation of a basic DAO (Decentralized Autonomous Organization)
* Features:

  * Create proposals
  * Vote on proposals
  * Execute proposals after deadline
* Demonstrates decentralized governance 

---

## 🛠️ Tech Stack Used

* **Solidity** – Smart contract development
* **Hardhat** – Development & deployment framework
* **MetaMask** – Wallet integration
* **React + Vite** – Frontend development
* **Node.js + Express** – Backend (IPFS)
* **IPFS (Pinata)** – Decentralized storage
* **Polygon Mumbai Testnet** – Deployment network
* **Ethereum Sepolia Testnet** – Testing network

---

## 🚀 How to Run Each Assignment

### 🔹 Assignment 1 (Smart Contract)

1. Open Remix IDE
2. Compile contract
3. Deploy using MetaMask
4. Call functions to add/verify certificates

---

### 🔹 Assignment 2 (Polygon Deployment)

```bash
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

---

### 🔹 Assignment 3 (Web3 App)

```bash
npm install
npx hardhat compile
npm run deploy:sepolia
npm run dev
```

* Open: http://localhost:5173
* Connect MetaMask

---

### 🔹 Assignment 4 (IPFS)

```bash
npm install
node server.js
```

* Open `index.html`
* Upload file → Get CID

---

### 🔹 Assignment 5 (DAO Contract)

1. Open Remix IDE
2. Compile DAO contract
3. Deploy using MetaMask
4. Execute:

   * createProposal
   * vote
   * executeProposal

---

## 🎯 Conclusion

These assignments demonstrate core Web3 concepts including:

* Smart contract development
* Blockchain deployment
* Frontend integration with MetaMask
* Decentralized storage using IPFS
* DAO-based governance systems

---

## 📌 Notes

* Ensure MetaMask is installed and connected to correct network
* Add `.env` for private keys and API URLs
* Never expose sensitive credentials publicly

---
