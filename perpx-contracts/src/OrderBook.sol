// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CustomPriceFeed.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IDIAOracleV2 {
    function getValue(string memory) external view returns (uint128, uint128);
}

contract OrderBook is Ownable {
    enum OrderType { Buy, Sell }

    struct Order {
        uint256 id;
        address trader;
        uint256 price;
        uint256 size;
        OrderType orderType;
        uint256 timestamp;
    }

    CustomPriceFeed public priceFeed;
    address public immutable DIA_ORACLE;
    uint256 public nextOrderId;
    mapping(uint256 => Order) public orders;
    uint256[] public orderIds;

    event OrderPlaced(uint256 id, address trader, uint256 price, uint256 size, OrderType orderType);
    event OrderCancelled(uint256 id, address trader);
    event OrderMatched(uint256 buyOrderId, uint256 sellOrderId, uint256 price, uint256 size);

    constructor(address _priceFeed, address _diaOracle) Ownable(msg.sender) {
        priceFeed = CustomPriceFeed(_priceFeed);
        DIA_ORACLE = _diaOracle;
    }

    function placeOrder(uint256 price, uint256 size, OrderType orderType) external {
        require(size > 0, "Order size must be greater than zero");

        uint256 orderId = nextOrderId++;
        orders[orderId] = Order(orderId, msg.sender, price, size, orderType, block.timestamp);
        orderIds.push(orderId);

        emit OrderPlaced(orderId, msg.sender, price, size, orderType);
    }

    function cancelOrder(uint256 orderId) external {
        require(orders[orderId].trader == msg.sender, "Only order owner can cancel");

        // Efficiently remove order from orderIds
        uint256 indexToRemove;
        for (uint256 i = 0; i < orderIds.length; i++) {
            if (orderIds[i] == orderId) {
                indexToRemove = i;
                break;
            }
        }
        orderIds[indexToRemove] = orderIds[orderIds.length - 1]; // Swap with last
        orderIds.pop(); // Remove last entry

        delete orders[orderId];

        emit OrderCancelled(orderId, msg.sender);
    }

    function matchOrders() external {
        for (uint256 i = 0; i < orderIds.length; i++) {
            Order storage buyOrder = orders[orderIds[i]];
            if (buyOrder.orderType != OrderType.Buy) continue;

            for (uint256 j = 0; j < orderIds.length; j++) {
                Order storage sellOrder = orders[orderIds[j]];
                if (sellOrder.orderType != OrderType.Sell) continue;

                if (buyOrder.price >= sellOrder.price) {
                    uint256 tradeSize = buyOrder.size < sellOrder.size ? buyOrder.size : sellOrder.size;
                    buyOrder.size -= tradeSize;
                    sellOrder.size -= tradeSize;

                    emit OrderMatched(buyOrder.id, sellOrder.id, sellOrder.price, tradeSize);

                    if (buyOrder.size == 0) delete orders[buyOrder.id];
                    if (sellOrder.size == 0) delete orders[sellOrder.id];

                    break;
                }
            }
        }
    }

    // Fetch price from the Oracle
    function getPriceFromDIA(string memory pair) external view returns (uint128 price, uint128 timestamp) {
        (price, timestamp) = IDIAOracleV2(DIA_ORACLE).getValue(pair);
    }

    // Fetch price from the CustomPriceFeed (for fallback purpose)
    function getLatestCustomPrice() external view returns (uint128, uint128) {
        return priceFeed.getLatestPrice();
    }

    // Combined function to fetch price (DIA Oracle first, fallback to CustomPriceFeed)
    function getPrice(string memory pair) external view returns (uint128 price, uint128 timestamp) {
        try IDIAOracleV2(DIA_ORACLE).getValue(pair) returns (uint128 p, uint128 t) {
            price = p;
            timestamp = t;
        } catch {
            (price, timestamp) = priceFeed.getLatestPrice();
        }
    }
}