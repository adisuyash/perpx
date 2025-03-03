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
    bool public isPaused = false;

    Order[] public buyOrders;
    Order[] public sellOrders;
    mapping(uint256 => uint256) public orderIndex; // Maps order ID to index

    event OrderPlaced(uint256 id, address trader, uint256 price, uint256 size, OrderType orderType);
    event OrderCancelled(uint256 id, address trader);
    event OrderMatched(uint256 buyOrderId, uint256 sellOrderId, uint256 price, uint256 size);

    constructor(address _priceFeed, address _diaOracle) {
        priceFeed = CustomPriceFeed(_priceFeed);
        DIA_ORACLE = _diaOracle;
    }

    modifier tradingAllowed() {
        require(!isPaused, "Trading is paused");
        _;
    }

    function pauseTrading() external onlyOwner {
        isPaused = true;
    }

    function resumeTrading() external onlyOwner {
        isPaused = false;
    }

    function placeOrder(uint256 price, uint256 size, OrderType orderType, uint256 slippage) external tradingAllowed {
        require(size > 0, "Order size must be greater than zero");
        require(slippage <= 100, "Slippage too high"); // Max 1% slippage allowed

        uint256 orderId = nextOrderId++;
        Order memory newOrder = Order(orderId, msg.sender, price, size, orderType, block.timestamp);

        if (orderType == OrderType.Buy) {
            buyOrders.push(newOrder);
            orderIndex[orderId] = buyOrders.length - 1;
        } else {
            sellOrders.push(newOrder);
            orderIndex[orderId] = sellOrders.length - 1;
        }

        emit OrderPlaced(orderId, msg.sender, price, size, orderType);
    }

    function cancelOrder(uint256 orderId) external {
        bool found = false;
        for (uint256 i = 0; i < buyOrders.length; i++) {
            if (buyOrders[i].id == orderId && buyOrders[i].trader == msg.sender) {
                removeBuyOrder(i);
                found = true;
                break;
            }
        }
        for (uint256 i = 0; i < sellOrders.length && !found; i++) {
            if (sellOrders[i].id == orderId && sellOrders[i].trader == msg.sender) {
                removeSellOrder(i);
                break;
            }
        }

        emit OrderCancelled(orderId, msg.sender);
    }

    function matchOrders() external tradingAllowed {
        uint256 i = 0;
        while (i < buyOrders.length) {
            Order storage buyOrder = buyOrders[i];

            uint256 j = 0;
            while (j < sellOrders.length) {
                Order storage sellOrder = sellOrders[j];

                if (buyOrder.price >= sellOrder.price) {
                    uint256 tradeSize = buyOrder.size < sellOrder.size ? buyOrder.size : sellOrder.size;
                    buyOrder.size -= tradeSize;
                    sellOrder.size -= tradeSize;

                    emit OrderMatched(buyOrder.id, sellOrder.id, sellOrder.price, tradeSize);

                    if (buyOrder.size == 0) {
                        removeBuyOrder(i);
                    } else {
                        i++;
                    }

                    if (sellOrder.size == 0) {
                        removeSellOrder(j);
                    } else {
                        j++;
                    }
                } else {
                    j++;
                }
            }
            i++;
        }
    }

    function getPriceFromDIA(string memory pair) external view returns (uint128 price, uint128 timestamp) {
        (price, timestamp) = IDIAOracleV2(DIA_ORACLE).getValue(pair);
    }

    function getLatestCustomPrice() external view returns (uint128, uint128) {
        return priceFeed.getLatestPrice();
    }

    function removeBuyOrder(uint256 index) internal {
        buyOrders[index] = buyOrders[buyOrders.length - 1]; // Move last element to removed position
        orderIndex[buyOrders[index].id] = index;
        buyOrders.pop();
    }

    function removeSellOrder(uint256 index) internal {
        sellOrders[index] = sellOrders[sellOrders.length - 1]; // Move last element to removed position
        orderIndex[sellOrders[index].id] = index;
        sellOrders.pop();
    }
}
