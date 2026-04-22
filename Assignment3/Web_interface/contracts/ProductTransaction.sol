// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ProductTransaction
/// @notice Stores product transaction records on-chain
contract ProductTransaction {

    struct Transaction {
        uint256 id;
        string  productId;
        string  productName;
        uint256 quantity;
        uint256 priceWei;       // price per unit in wei
        address sender;
        address receiver;
        uint256 timestamp;
    }

    uint256 private _txCounter;
    Transaction[] private _transactions;

    event ProductTransactionAdded(
        uint256 indexed id,
        address indexed sender,
        address indexed receiver,
        string  productId,
        string  productName,
        uint256 quantity,
        uint256 priceWei,
        uint256 timestamp
    );

    /// @notice Add a new product transaction (payable — sends ETH to receiver)
    function addProductTransaction(
        string  calldata productId,
        string  calldata productName,
        uint256 quantity,
        uint256 priceWei,
        address payable receiver
    ) external payable {
        require(bytes(productId).length   > 0, "Product ID required");
        require(bytes(productName).length > 0, "Product name required");
        require(quantity > 0,                  "Quantity must be > 0");
        require(receiver != address(0),        "Invalid receiver");

        uint256 expected = priceWei * quantity;
        require(msg.value == expected, "msg.value must equal priceWei * quantity");

        // Forward ETH to receiver
        (bool sent, ) = receiver.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        _txCounter++;
        _transactions.push(Transaction({
            id:          _txCounter,
            productId:   productId,
            productName: productName,
            quantity:    quantity,
            priceWei:    priceWei,
            sender:      msg.sender,
            receiver:    receiver,
            timestamp:   block.timestamp
        }));

        emit ProductTransactionAdded(
            _txCounter,
            msg.sender,
            receiver,
            productId,
            productName,
            quantity,
            priceWei,
            block.timestamp
        );
    }

    /// @notice Get total number of transactions
    function getTransactionCount() external view returns (uint256) {
        return _txCounter;
    }

    /// @notice Get a single transaction by index (0-based)
    function getTransaction(uint256 index) external view returns (Transaction memory) {
        require(index < _transactions.length, "Index out of bounds");
        return _transactions[index];
    }

    /// @notice Get all transactions
    function getAllTransactions() external view returns (Transaction[] memory) {
        return _transactions;
    }
}
