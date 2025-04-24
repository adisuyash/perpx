import { useEffect, useState, useCallback } from "react";
import TradeHeader from "../components/TradeHeader";
import TradingViewWidget from "../components/TradingViewWidget";
import Positions from "../components/Positions";
import Orderbook from "../components/Orderbook";
import BuyandSell from "../components/BuyandSell";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

const Values = () => {
  const { connected } = useConnection();
  const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
  const [isFetching, setIsFetching] = useState(false);
  const [valueList, setValueList] = useState([]);
  const [error, setError] = useState(null);

  const syncValue = useCallback(async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "GetIndexPrice" }],
        anchor: "1234",
      });
      console.log("Values: ", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      setValueList(filteredResult[0] || []);
    } catch (error) {
      console.error("Failed to fetch the values", error);
      setError("Failed to fetch the values");
    } finally {
      setIsFetching(false);
    }
  }, [connected, processId]);

  useEffect(() => {
    setIsFetching(true);
    syncValue();
  }, [connected, syncValue]);

  return (
    <div>
      <TradeHeader />
      <div style={styles.mainrow}>
        <main style={styles.mainBox} className="flex">
          <div className="flex-[3]">
            <div style={styles.marketDataContainer}>
              {error ? (
                <p style={styles.error}>{error}</p>
              ) : (
                <div style={styles.marketDataGrid}>
                  {isFetching ? (
                    <p>Loading data...</p>
                  ) : (
                    valueList.map((item, index) => (
                      <div key={index} style={styles.marketDataRow}>
                        <div style={styles.cell}>AR / USD</div>
                        <div style={styles.cell}>Oracle Price</div>
                        <div style={styles.value}>{item.IndexPrice}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div>
              <TradingViewWidget />
            </div>
          </div>
          <div className="flex-[1]">
            <Orderbook />
          </div>
          <div className="flex-[1]">
            <BuyandSell />
          </div>
        </main>
        <Positions />
      </div>
    </div>
  );
};

const styles = {
  mainrow: {
    marginTop: "15px",
  },

  mainBox: {
    height: "700px",
    padding: "0",
    marginBottom: "0"
  },

  marketDataContainer: {
    padding: "7px 10px",
    height: "50px",
    backgroundColor: "#16181d",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #333",
    // borderLeft: "1px solid #333",
    // borderRight: "1px solid #333",
    // borderTop: "1px solid #333",
  },
  marketDataGrid: {
    display: "flex",
    flexDirection: "column",
    padding: "5px 10px",
  },
  marketDataRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cell: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "0 10px",
    fontSize: "18px",
    fontWeight: "400",
  },
  label: {
    fontSize: "16px",
    color: "#888",
    marginBottom: "5px",
  },
  // currency: {
  //   fontSize: "20px",
  //   color: "#FFF",
  //   marginBottom: "0",
  // },
  value: {
    fontSize: "14px",
    fontWeight: "400",
  },
  error: {
    color: "red",
  },
};

export default Values;
