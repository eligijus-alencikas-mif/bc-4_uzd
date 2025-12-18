# Deal DApp Front-end

Simple React/Vite front-end for interacting with the Deal contract.

Quick start:

1. cd front-end
2. npm install
3. npm run dev

Usage:

-   Connect MetaMask
-   Paste your deployed Deal contract address and click "Load Contract"
-   Use the forms to call methods (sendOrder, sendPrice, sendSafepay, sendInvoice, queryOrder)

Notes:

-   Contract ABI is loaded from `../../build/contracts/Deal.json`. Ensure you compiled with Truffle and the `build/contracts/Deal.json` artifact exists.
-   Value fields use ETH amounts where indicated.
