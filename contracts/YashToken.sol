// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YashToken is ERC20, Ownable {

    address[] private _holders;
    mapping(address => bool) private _isHolder;

    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }

    Transaction[] public transactions;

    constructor(uint256 initialSupply) ERC20("YashToken", "YASH") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        _addHolder(msg.sender);
    }

    function _addHolder(address account) private {
        if (!_isHolder[account] && balanceOf(account) > 0) {
            _holders.push(account);
            _isHolder[account] = true;
        }
    }

    // Instead of overriding _transfer, use _update which is virtual
    function _update(address from, address to, uint256 amount) internal virtual override {
        super._update(from, to, amount);
        
        transactions.push(Transaction({
            from: from,
            to: to,
            amount: amount,
            timestamp: block.timestamp
        }));

        if (from != address(0)) _addHolder(from);
        if (to != address(0)) _addHolder(to);
    }

    function getAllHolders() external view returns (address[] memory) {
        return _holders;
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint index) external view returns (address from, address to, uint256 amount, uint256 timestamp) {
        require(index < transactions.length, "Index out of bounds");
        Transaction memory txn = transactions[index];
        return (txn.from, txn.to, txn.amount, txn.timestamp);
    }
}