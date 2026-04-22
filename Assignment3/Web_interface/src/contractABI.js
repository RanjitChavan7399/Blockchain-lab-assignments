// src/contractABI.js
// ABI for ProductTransaction.sol
// This matches exactly the functions defined in contracts/ProductTransaction.sol

export const CONTRACT_ABI = [
  // Write functions
  "function addProductTransaction(string productId, string productName, uint256 quantity, uint256 priceWei, address receiver) external payable",

  // Read functions
  "function getTransactionCount() external view returns (uint256)",
  "function getTransaction(uint256 index) external view returns (tuple(uint256 id, string productId, string productName, uint256 quantity, uint256 priceWei, address sender, address receiver, uint256 timestamp))",
  "function getAllTransactions() external view returns (tuple(uint256 id, string productId, string productName, uint256 quantity, uint256 priceWei, address sender, address receiver, uint256 timestamp)[])",

  // Events
  "event ProductTransactionAdded(uint256 indexed id, address indexed sender, address indexed receiver, string productId, string productName, uint256 quantity, uint256 priceWei, uint256 timestamp)",
];
