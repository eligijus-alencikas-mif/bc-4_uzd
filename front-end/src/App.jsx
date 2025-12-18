import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import DealArtifact from "../../build/contracts/Deal.json";

export default function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [contractAddr, setContractAddr] = useState("");
    const [contract, setContract] = useState(null);
    const [logs, setLogs] = useState([]);
    const [owner, setOwner] = useState("");
    const [buyerAddr, setBuyerAddr] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            const p = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(p);
        }
    }, []);

    async function connectWallet() {
        if (!provider) return alert("Install MetaMask");
        await provider.send("eth_requestAccounts", []);
        const s = provider.getSigner();
        setSigner(s);
        const a = await s.getAddress();
        setAccount(a);
        log(`Connected ${a}`);
    }

    function log(msg) {
        setLogs((l) => [...l, `${new Date().toLocaleTimeString()} - ${msg}`]);
    }

    function loadContract() {
        if (!ethers.utils.isAddress(contractAddr))
            return alert("Enter valid contract address");
        const c = new ethers.Contract(
            contractAddr,
            DealArtifact.abi,
            signer || provider
        );
        setContract(c);
        log(`Loaded contract at ${contractAddr}`);
        fetchBasicInfo(c);
    }

    async function fetchBasicInfo(c) {
        try {
            const o = await c.owner();
            const b = await c.buyerAddr();
            setOwner(o);
            setBuyerAddr(b);
            log(`owner=${o} buyer=${b}`);
        } catch (e) {
            log("Error fetching basic info: " + e.message);
        }
    }

    async function sendOrder(e) {
        e.preventDefault();
        const goods = e.target.goods.value;
        const qty = e.target.quantity.value;
        try {
            const tx = await contract.connect(signer).sendOrder(goods, qty);
            log("sendOrder tx: " + tx.hash);
            await tx.wait();
            log("sendOrder mined");
        } catch (e) {
            log("sendOrder failed: " + (e.message || e));
        }
    }

    async function sendPrice(e) {
        e.preventDefault();
        const orderno = e.target.orderno.value;
        const price = e.target.price.value;
        const ttype = e.target.ttype.value;
        try {
            const tx = await contract
                .connect(signer)
                .sendPrice(orderno, price, ttype);
            log("sendPrice tx: " + tx.hash);
            await tx.wait();
            log("sendPrice mined");
        } catch (e) {
            log("sendPrice failed: " + (e.message || e));
        }
    }

    async function sendSafepay(e) {
        e.preventDefault();
        const orderno = e.target.saf_orderno.value;
        const valueEth = e.target.saf_value.value;
        try {
            const value = ethers.utils.parseEther(valueEth);
            const tx = await contract
                .connect(signer)
                .sendSafepay(orderno, { value });
            log("sendSafepay tx: " + tx.hash);
            await tx.wait();
            log("sendSafepay mined");
        } catch (e) {
            log("sendSafepay failed: " + (e.message || e));
        }
    }

    async function sendInvoice(e) {
        e.preventDefault();
        const orderno = e.target.inv_orderno.value;
        const delivery_date = e.target.delivery_date.value;
        const courier = e.target.courier.value;
        try {
            const tx = await contract
                .connect(signer)
                .sendInvoice(orderno, delivery_date, courier);
            log("sendInvoice tx: " + tx.hash);
            await tx.wait();
            log("sendInvoice mined");
        } catch (e) {
            log("sendInvoice failed: " + (e.message || e));
        }
    }

    async function queryOrder(e) {
        e.preventDefault();
        const number = e.target.q_orderno.value;
        try {
            const data = await contract.queryOrder(number);
            log("Order: " + JSON.stringify(data));
        } catch (e) {
            log("queryOrder failed: " + (e.message || e));
        }
    }

    return (
        <div className="container">
            <h1>Deal DApp</h1>

            <div className="field">
                <button onClick={connectWallet} disabled={!provider}>
                    Connect Wallet
                </button>
                {account && <div>Account: {account}</div>}
            </div>

            <div className="field">
                <label>Contract address</label>
                <input
                    value={contractAddr}
                    onChange={(e) => setContractAddr(e.target.value)}
                    placeholder="0x..."
                />
                <button onClick={loadContract} disabled={!contractAddr}>
                    Load Contract
                </button>
            </div>

            {contract && (
                <div>
                    <div>
                        <strong>Owner:</strong> {owner}
                    </div>
                    <div>
                        <strong>Buyer:</strong> {buyerAddr}
                    </div>

                    <hr />
                    <h3>Send Order</h3>
                    <form onSubmit={sendOrder}>
                        <div className="field">
                            <label>Goods</label>
                            <input name="goods" />
                        </div>
                        <div className="field">
                            <label>Quantity</label>
                            <input name="quantity" type="number" />
                        </div>
                        <button type="submit">Send Order</button>
                    </form>

                    <hr />
                    <h3>Send Price</h3>
                    <form onSubmit={sendPrice}>
                        <div className="field">
                            <label>Order No</label>
                            <input name="orderno" />
                        </div>
                        <div className="field">
                            <label>Price (wei)</label>
                            <input name="price" />
                        </div>
                        <div className="field">
                            <label>Type (1=order,2=shipment)</label>
                            <input name="ttype" />
                        </div>
                        <button type="submit">Send Price</button>
                    </form>

                    <hr />
                    <h3>Send Safepay</h3>
                    <form onSubmit={sendSafepay}>
                        <div className="field">
                            <label>Order No</label>
                            <input name="saf_orderno" />
                        </div>
                        <div className="field">
                            <label>Value (ETH)</label>
                            <input name="saf_value" placeholder="0.1" />
                        </div>
                        <button type="submit">Send Safepay</button>
                    </form>

                    <hr />
                    <h3>Send Invoice</h3>
                    <form onSubmit={sendInvoice}>
                        <div className="field">
                            <label>Order No</label>
                            <input name="inv_orderno" />
                        </div>
                        <div className="field">
                            <label>Delivery Date (unix)</label>
                            <input name="delivery_date" />
                        </div>
                        <div className="field">
                            <label>Courier Address</label>
                            <input name="courier" />
                        </div>
                        <button type="submit">Send Invoice</button>
                    </form>

                    <hr />
                    <h3>Query Order</h3>
                    <form onSubmit={queryOrder}>
                        <div className="field">
                            <label>Order No</label>
                            <input name="q_orderno" />
                        </div>
                        <button type="submit">Query</button>
                    </form>
                </div>
            )}

            <div className="log">
                {logs.map((l, i) => (
                    <div key={i}>{l}</div>
                ))}
            </div>
        </div>
    );
}
