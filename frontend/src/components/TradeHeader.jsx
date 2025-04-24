import React, { useState } from "react";
import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";
import "../index.css";

const TradeHeader = () => {
  const { connected } = useConnection();
  const [buttonWidth, setButtonWidth] = useState("200px"); // Initial width

  React.useEffect(() => {
    if (connected) {
      const buttonElement = document.querySelector(".connect-button");
      if (buttonElement) {
        setButtonWidth(`300px`);
      }
    } else {
      setButtonWidth("200px"); // Reset to default width when not connected
    }
  }, [connected]);

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <Link to="/">
          <img src="/PerpX-Logo.png" alt="Logo" style={styles.logo} />
        </Link>
      </div>
      <div>
        <nav style={styles.navigation}>
          <Link to="/">Home</Link>
        </nav>
      </div>
      <div>
        <ConnectButton
          style={{ ...styles.button, width: buttonWidth }}
          className="connect-button"
        />
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "50px",
    padding: "60px 70px 45px 70px",
    backgroundColor: "transparent",
    width: "100%",
    top: "0",
    left: "0",
    right: "0",
  },
  button: {
    width: "200px",
    padding: "10px 0",
    backgroundColor: "#16181D",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "50px", // Capsule shape
    cursor: "pointer",
    fontSize: "16px",
    transition: "box-shadow 0.3s ease",
    boxShadow: "0 0 25px rgba(80, 210, 193, 0.3)", // Blur effect on all sides
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    marginLeft: "5rem",
    fontSize: "1.2rem",
  },
  logo: {
    width: "60px",
    height: "60px",
  },
};

export default TradeHeader;
