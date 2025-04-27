# PerpX

PerpX is a decentralized perpetual exchange built on the EDU Chain. It empowers users to create synthetic assets that track the price of real-world assets without requiring actual ownership.

**Live Deployment on Vercel:** https://perpx.vercel.app

### Network Config:
---
Here are the network configurations for the EDU Chain: https://educhain.xyz/

| Key            | Value                                                                                |
| -------------- | ------------------------------------------------------------------------------------ |
| Token          | `EDU`                                                                                |
| Chain ID       | `656476`                                                                             |
| RPC_URL        | `https://rpc.open-campus-codex.gelato.digital`                                       |
| Block Explorer | [https://edu-chain-testnet.blockscout.com](https://edu-chain-testnet.blockscout.com) |

### Deployments:
---

| Key                                                                                 | Contract Addresses                                                                                                                        |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| DIA Oracle Deployment Address                                                       | [0x6626f442eBc679f7e35bC62E36E3c1e8820C81C9](https://edu-chain-testnet.blockscout.com/address/0x6626f442eBc679f7e35bC62E36E3c1e8820C81C9) |
| [`CustomPriceFeed.sol`](perpx-contracts/src/CustomPriceFeed.sol) Deployment Address | [0x592C7BEE8B59c0bbE6E431e35b47469CD56de421](https://edu-chain-testnet.blockscout.com/address/0x592C7BEE8B59c0bbE6E431e35b47469CD56de421) |
| [`OrderBook.sol`](perpx-contracts/src/OrderBook.sol) Deployment Address             | [0xB6d356A248c9aA410a3b91Bca7Eaf0BE3E15AE0d](https://edu-chain-testnet.blockscout.com/address/0xB6d356A248c9aA410a3b91Bca7Eaf0BE3E15AE0d) |
| Owner Address (Mine)                                                                | [0x225d5a1079121faD050a33bDf1373bAf71aa4219](https://edu-chain-testnet.blockscout.com/address/0x225d5a1079121faD050a33bDf1373bAf71aa4219) |

## Project Structure

The PerpX project is organized into two main parts:

### Frontend

The frontend code is located in the `frontend` folder of our GitHub repository.

**Folder Structure**

```plaintext
/frontend
├── public
├── src
├── package.json
├── README.md
└── ... (other necessary files and folders)
```

### Backend

The backend code version is available in the `backend` folder of our GitHub repository.

## Getting Started

To get started with PerpX, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/adisuyash/perpx.git
   cd perpx/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Your development server will start. Start working with PerpX.
