import { useState } from 'react';
import '../components/BuySellComponent.css';
import { message } from "@permaweb/aoconnect";
import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner } from "@permaweb/aoconnect";

function BuySellComponent() {
  const [orderType, setOrderType] = useState('buy_long');
  const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [status, setStatus] = useState('');
  const { connected } = useConnection();

  const submitOrderToBackend = async (orderDetails) => {
    try {
      const side = orderType === 'buy_long' ? 'Long' : 'Short';
      const action = orderType === 'buy_long' ? 'buy' : 'sell'; // Define the action variable

      const res = await message({
        process: processId,
        signer: createDataItemSigner(window.arweaveWallet),
        tags: [
          { name: "Action", value: "PlaceOrder" },
          { name: "MarketID", value: "2298405b" },
          { name: "OrderType", value: side },
          { name: "Side", value: side },
          { name: "Amount", value: orderDetails.size.toString() },
          { name: "Price", value: orderDetails.price.toString() },
          { name: "Leverage", value: orderDetails.leverage.toString() }
        ],
        data: JSON.stringify(orderDetails),
      });
      console.log("Response from backend:", res);
      return `${action} order placed successfully`; // Use the action variable
    } catch (error) {
      console.error("Error submitting to backend:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected) {
      setStatus("Not connected");
      return;
    }

    try {
      const orderDetails = { price, size, leverage };
      const result = await submitOrderToBackend(orderDetails);
      setStatus(result);
    } catch (error) {
      setStatus(`Failed to place ${orderType === 'buy_long' ? 'buy' : 'sell'} order`);
    }

    setPrice('');
    setSize('');
    setLeverage(1);
  };

  return (
    <div className="buy-sell-component">
      <h2 className="order-title">Place Order</h2>
      <div className="order-type-toggle">
        <button
          className={`toggle-button ${orderType === 'buy_long' ? 'active buy' : ''}`}
          onClick={() => setOrderType('buy_long')}
        >
          Buy / Long
        </button>
        <button
          className={`toggle-button ${orderType === 'sell_short' ? 'active sell' : ''}`}
          onClick={() => setOrderType('sell_short')}
        >
          Sell / Short
        </button>
      </div>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="price">Price (in USD)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder={`Enter ${orderType === 'buy_long' ? 'Buying' : 'Selling'} Price`}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="size">Amount</label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            min="0"
            step="0.0001"
            placeholder={`Enter Amount To ${orderType === 'buy_long' ? 'Buy' : 'Sell'}`}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="leverage">Leverage (optional)</label>
          <input
            type="range"
            id="leverage"
            min="1"
            max="25"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="leverage-slider"
          />
          <span className="leverage-value">{leverage}x</span>
        </div>
        <button
          type="submit"
          className={`submit-button ${orderType === 'buy_long' ? 'buy' : 'sell'}`}
        >
          {orderType === 'buy_long' ? 'Buy / Long' : 'Sell / Short'}
        </button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default BuySellComponent;