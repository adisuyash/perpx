import { useState, useEffect, useCallback } from 'react';
import '../components/Orderbook.css';
import { useConnection } from "@arweave-wallet-kit/react";

function Orderbook() {
    const { connected } = useConnection();
    // Removed unused isFetching state
    const [asks, setAsks] = useState([]);
    const [bids, setBids] = useState([]);
    const [spread, setSpread] = useState(0);
    const [error, setError] = useState(null);

    const calculateSpread = (lowestAsk, highestBid) => {
        if (lowestAsk && highestBid) {
            const spreadValue = lowestAsk.Price - highestBid.Price;
            setSpread(spreadValue.toFixed(2));
        }
    };

    const fetchOrderbookData = useCallback(async () => {
        if (!connected) return;

        // Removed isFetching state update
        setError(null);

        try {
            // 💡 Dummy order book data (simulate AO dryrun response)
            const dummyData = [
                { Side: "Short", Price: 101.25, Amount: 0.45 },
                { Side: "Short", Price: 102.10, Amount: 1.2 },
                { Side: "Short", Price: 103.50, Amount: 0.75 },
                { Side: "Long", Price: 100.20, Amount: 0.6 },
                { Side: "Long", Price: 99.80, Amount: 1.5 },
                { Side: "Long", Price: 98.30, Amount: 0.8 }
            ];

            const askOrders = dummyData.filter(order => order.Side === 'Short')
                .sort((a, b) => a.Price - b.Price);
            const bidOrders = dummyData.filter(order => order.Side === 'Long')
                .sort((a, b) => b.Price - a.Price);

            setAsks(askOrders.slice(0, 10));
            setBids(bidOrders.slice(0, 10));

            if (askOrders.length > 0 && bidOrders.length > 0) {
                calculateSpread(askOrders[0], bidOrders[0]);
            }

        } catch (error) {
            console.error("Failed to simulate orderbook data", error);
            setError("Failed to load dummy orderbook data");
        }
    }, [connected]);

    useEffect(() => {
        if (connected) {
            fetchOrderbookData();
        }
    }, [connected, fetchOrderbookData]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="orderbook">
            <h2 className="order-title">Order Book</h2>
            <div className="orderbook-container">
                <div className="order-column asks">
                    <div className="order-header">
                        <span>Price</span>
                        <span>Amount</span>
                        <span>Total</span>
                    </div>
                    {asks.map((order, index) => (
                        <div key={index} className="order-row ask">
                            <span>{order.Price.toFixed(2)}</span>
                            <span>{order.Amount.toFixed(4)}</span>
                            <span>{(order.Price * order.Amount).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="spread-display">
                    <span>Spread</span>
                    <span>{spread}</span>
                </div>
                <div className="order-column bids">
                    {bids.map((order, index) => (
                        <div key={index} className="order-row bid">
                            <span>{order.Price.toFixed(2)}</span>
                            <span>{order.Amount.toFixed(4)}</span>
                            <span>{(order.Price * order.Amount).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Orderbook;
