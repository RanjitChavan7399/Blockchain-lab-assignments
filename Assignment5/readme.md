Assignment 5: DAO Smart Contract
📌 Brief Description
This assignment implements a basic Decentralized Autonomous Organization (DAO) using a smart contract.
The DAO allows users to:

Create proposals
Vote on proposals
Execute proposals after a deadline
All actions are recorded on the blockchain, ensuring transparency and decentralization.

🛠️ Tech Stack Used
Solidity (0.8.x)
Remix IDE
MetaMask
Sepolia Testnet
📜 Smart Contract Features
✔ Proposal Creation
Only the contract owner can create a proposal
Each proposal includes:
Description
Vote count
Deadline
Execution status
✔ Voting Mechanism
Users can vote on a proposal using its ID
Each address can vote only once per proposal
Votes are counted using a voteCount variable
✔ Proposal Execution
A proposal can be executed after the deadline
Execution marks the proposal as completed
Ensures proposal cannot be executed multiple times
⚙️ DAO Workflow
Create Proposal

User submits proposal with description and duration
Stored on blockchain
Vote

Users vote using proposal ID
Votes are counted
Wait for Deadline

Proposal remains open until deadline
Execute Proposal

After deadline, proposal is executed
Status changes to executed = true
🚀 How to Run
▶️ Step 1: Open Remix
Go to https://remix.ethereum.org
▶️ Step 2: Compile Contract
Open dao.sol
Select Solidity compiler (0.8.x)
Click Compile
▶️ Step 3: Deploy Contract
Go to Deploy & Run Transactions
Select Browser Extension (MetaMask)
Connect wallet
Select Sepolia Testnet
Click Deploy
Confirm transaction in MetaMask
🧪 Execution Steps
🟢 1. Create Proposal
Call function: createProposal
Input:
Description: "Buy new equipment"
Duration: 60 seconds
Confirm in MetaMask
🔵 2. Vote on Proposal
Call function: vote
Input:
Proposal ID: 0
Confirm transaction
🟡 3. Execute Proposal
Wait until deadline (~60 seconds)
Call function: executeProposal(0)
Confirm transaction
🔍 4. View Proposals
Call function: getProposals()
Displays:
Description
Vote count
Deadline
Execution status
🎯 Key Concepts Demonstrated
Decentralized governance
Smart contract-based voting
Proposal lifecycle management
Blockchain transparency
📚 Reference
Decentralized Autonomous Organizations Guide:
https://medium.com/@cromewar/decentralized-autonomous-organizations-a-step-by-step-guide-468c11179ced

