// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomPriceFeed is Ownable {
    uint128 public latestPrice;
    uint128 public lastUpdated;

    event PriceUpdated(uint128 newPrice, uint128 timestamp);

    constructor() Ownable(msg.sender) {}

    function setPrice(uint128 _newPrice) external onlyOwner {
        latestPrice = _newPrice;
        lastUpdated = uint128(block.timestamp);
        emit PriceUpdated(_newPrice, lastUpdated);
    }

    function getLatestPrice() external view returns (uint128, uint128) {
        return (latestPrice, lastUpdated);
    }
}
