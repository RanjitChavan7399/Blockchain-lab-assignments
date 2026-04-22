# ChainTrade — Blockchain Product Transactions

## Project Structure

```
chaintrade/
├── contracts/
│   └── ProductTransaction.sol   ← Solidity smart contract
├── scripts/
│   └── deploy.js                ← Hardhat deploy script
├── src/
│   ├── config.js                ← reads .env variables (CONTRACT_ADDRESS etc.)
│   ├── contractABI.js           ← ABI for the smart contract
│   ├── App.jsx                  ← React frontend
│   └── main.jsx                 ← Entry point
├── .env                         ← YOUR secrets (never commit this)
├── .env.example                 ← Template (safe to commit)
├── hardhat.config.ts
├── vite.config.js
├── index.html
└── package.json
```

---

## Setup & Deployment — Step by Step

### 1. Install dependencies
```
npm install
```

### 2. Fill in your .env file

Open `.env` and fill in:

| Variable | Where to get it |
|---|---|
| `DEPLOYER_PRIVATE_KEY` | MetaMask → Account Details → Export Private Key |
| `VITE_RPC_URL` | https://www.alchemy.com → Create App → Sepolia → copy HTTPS URL |
| `ETHERSCAN_API_KEY` | https://etherscan.io/myapikey (optional, for verification) |

### 3. Get Sepolia test ETH
Go to https://sepoliafaucet.com and paste your wallet address.
You need at least 0.01 SepoliaETH to deploy.

### 4. Compile the smart contract
```
npx hardhat compile
```

### 5. Deploy to Sepolia
```
npm run deploy:sepolia
```
This will:
- Deploy `ProductTransaction.sol` to Sepolia
- **Automatically write the contract address into your `.env` file**

### 6. Start the frontend
```
npm run dev
```
Open http://localhost:5173

---

## How the .env works in code

```
.env                            src/config.js                  src/App.jsx
VITE_CONTRACT_ADDRESS=0x...  →  export const CONTRACT_ADDRESS  import { CONTRACT_ADDRESS }
                                = import.meta.env               from './config'
                                  .VITE_CONTRACT_ADDRESS
```

Only `config.js` reads from `import.meta.env`. All other files import from `config.js`.
