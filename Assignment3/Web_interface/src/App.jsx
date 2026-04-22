import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CHAIN_ID, CHAIN_ID_HEX, EXPLORER_URL } from "./config";
import { CONTRACT_ABI } from "./contractABI";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const truncate = (str = "", len = 10) =>
  str.length <= len * 2 ? str : str.slice(0, len) + "…" + str.slice(-6);

const NETWORK_NAMES = {
  "0x1":      "Ethereum Mainnet",
  "0xaa36a7": "Sepolia Testnet",
  "0x5":      "Goerli",
  "0x89":     "Polygon",
};

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [provider, setProvider]         = useState(null);
  const [signer, setSigner]             = useState(null);
  const [address, setAddress]           = useState(null);
  const [balance, setBalance]           = useState(null);
  const [networkName, setNetworkName]   = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [signature, setSignature]       = useState(null);
  const [gasInfo, setGasInfo]           = useState(null);
  const [txHistory, setTxHistory]       = useState(() =>
    JSON.parse(localStorage.getItem("chainTradeTxs") || "[]")
  );
  const [toasts, setToasts]   = useState([]);
  const [signing, setSigning] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm]       = useState({ productId:"", productName:"", quantity:"", price:"", receiver:"" });
  const [errors, setErrors]   = useState({});

  // ── Toast ──────────────────────────────────────────────────────────────────
  const toast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  // ── Balance ────────────────────────────────────────────────────────────────
  const refreshBalance = useCallback(async (prov, addr) => {
    try {
      const bal = await prov.getBalance(addr);
      setBalance(parseFloat(ethers.formatEther(bal)).toFixed(5) + " ETH");
    } catch {}
  }, []);

  // ── Network ────────────────────────────────────────────────────────────────
  const checkNetwork = useCallback(async (prov) => {
    const net   = await prov.getNetwork();
    const hex   = "0x" + net.chainId.toString(16);
    const name  = NETWORK_NAMES[hex] || "Chain " + net.chainId;
    setNetworkName(name);
    setWrongNetwork(hex !== CHAIN_ID_HEX);
  }, []);

  // ── Connect ────────────────────────────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast("MetaMask not found. Please install it.", "error");
      return;
    }
    try {
      const prov     = new ethers.BrowserProvider(window.ethereum);
      const accounts = await prov.send("eth_requestAccounts", []);
      const sgn      = await prov.getSigner();
      setProvider(prov);
      setSigner(sgn);
      setAddress(accounts[0]);
      await refreshBalance(prov, accounts[0]);
      await checkNetwork(prov);
      toast("Wallet connected!", "success");
    } catch (e) {
      if (e.code === 4001) toast("Connection rejected.", "warn");
      else toast("Connect error: " + e.message, "error");
    }
  };

  const disconnectWallet = () => {
    setProvider(null); setSigner(null); setAddress(null);
    setBalance(null); setNetworkName(null); setWrongNetwork(false);
    setSignature(null); setGasInfo(null);
    resetForm();
    toast("Wallet disconnected.", "info");
  };

  // ── Switch network ─────────────────────────────────────────────────────────
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch (e) {
      if (e.code === 4902) {
        // Sepolia not in MetaMask — add it
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: CHAIN_ID_HEX,
              chainName: "Sepolia Testnet",
              rpcUrls: ["https://rpc.sepolia.org"],
              nativeCurrency: { name:"SepoliaETH", symbol:"ETH", decimals:18 },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            }],
          });
        } catch { toast("Could not add Sepolia network.", "error"); }
      } else {
        toast("Switch failed: " + e.message, "error");
      }
    }
  };

  // ── MetaMask events ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = async (accounts) => {
      if (!accounts.length) { disconnectWallet(); return; }
      setAddress(accounts[0]);
      if (provider) {
        setSigner(await provider.getSigner());
        await refreshBalance(provider, accounts[0]);
        toast("Account changed.", "info");
      }
    };
    const onChain = async () => {
      if (!provider) return;
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);
      setSigner(await prov.getSigner());
      await checkNetwork(prov);
      if (address) await refreshBalance(prov, address);
      toast("Network changed.", "info");
    };
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccounts);
      window.ethereum.removeListener("chainChanged", onChain);
    };
  }, [provider, address]);

  // ── Form ───────────────────────────────────────────────────────────────────
  const total = () => {
    const p = parseFloat(form.price) || 0;
    const q = parseFloat(form.quantity) || 0;
    return (p * q).toFixed(6);
  };

  const validate = () => {
    const e = {};
    if (!form.productId.trim())                    e.productId   = "Required";
    if (!form.productName.trim())                  e.productName = "Required";
    if (!(parseFloat(form.quantity) > 0))          e.quantity    = "Must be > 0";
    if (!(parseFloat(form.price) >= 0))            e.price       = "Must be ≥ 0";
    if (!ethers.isAddress(form.receiver.trim()))   e.receiver    = "Invalid Ethereum address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setForm({ productId:"", productName:"", quantity:"", price:"", receiver:"" });
    setErrors({});
    setSignature(null);
    setGasInfo(null);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: undefined }));
  };

  const buildPayload = () => ({
    productId:   form.productId.trim(),
    productName: form.productName.trim(),
    quantity:    parseInt(form.quantity),
    price:       parseFloat(form.price),
    receiver:    form.receiver.trim(),
    timestamp:   Date.now(),
  });

  // ── Sign ───────────────────────────────────────────────────────────────────
  const signTransaction = async () => {
    if (!signer) { toast("Connect wallet first.", "warn"); return; }
    if (!validate()) return;
    setSigning(true);
    try {
      const payload = buildPayload();
      const sig = await signer.signMessage(JSON.stringify(payload, null, 2));
      setSignature(sig);
      toast("Message signed!", "success");
      // estimate gas
      try {
        const to    = CONTRACT_ADDRESS || form.receiver.trim();
        const value = ethers.parseEther(total());
        const data  = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(payload)));
        const est   = await provider.estimateGas({ from: address, to, value, data });
        const fee   = await provider.getFeeData();
        const cost  = ethers.formatEther(est * (fee.gasPrice || 0n));
        setGasInfo(`~${parseFloat(cost).toFixed(8)} ETH  (${est.toString()} gas units)`);
      } catch {}
    } catch (e) {
      if (e.code === 4001) toast("Signing rejected.", "warn");
      else toast("Sign error: " + e.message, "error");
    } finally {
      setSigning(false);
    }
  };

  // ── Send ───────────────────────────────────────────────────────────────────
  const sendTransaction = async () => {
    if (!signer) { toast("Connect wallet first.", "warn"); return; }
    if (!validate()) return;
    setSending(true);

    const payload = buildPayload();
    const value   = ethers.parseEther(total());

    const record = {
      id: Date.now(), hash: null,
      product: `${payload.productName} ×${payload.quantity}`,
      amount: total() + " ETH",
      receiver: truncate(form.receiver.trim()),
      status: "pending",
      timestamp: new Date().toLocaleString(),
    };

    const newHistory = [record, ...txHistory];
    setTxHistory(newHistory);
    localStorage.setItem("chainTradeTxs", JSON.stringify(newHistory));
    toast("Submitted to MetaMask…", "info");

    try {
      let tx;

      if (CONTRACT_ADDRESS) {
        // ── Call deployed smart contract (address from .env) ──
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        tx = await contract.addProductTransaction(
          payload.productId,
          payload.productName,
          BigInt(payload.quantity),
          ethers.parseEther(String(payload.price)),  // priceWei per unit
          payload.receiver,
          { value }
        );
      } else {
        // ── Fallback: plain ETH transfer ──
        const data = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(payload)));
        tx = await signer.sendTransaction({ to: form.receiver.trim(), value, data });
      }

      // Update hash
      const h1 = newHistory.map((t) => t.id === record.id ? { ...t, hash: tx.hash } : t);
      setTxHistory(h1);
      localStorage.setItem("chainTradeTxs", JSON.stringify(h1));
      toast("TX sent! " + truncate(tx.hash), "success");

      // Wait for confirmation
      const receipt = await tx.wait();
      const status  = receipt.status === 1 ? "success" : "failed";
      const h2      = h1.map((t) => t.id === record.id ? { ...t, status } : t);
      setTxHistory(h2);
      localStorage.setItem("chainTradeTxs", JSON.stringify(h2));
      toast(status === "success" ? "✓ Confirmed on Sepolia!" : "✗ Transaction failed.", status === "success" ? "success" : "error");
      await refreshBalance(provider, address);
      resetForm();
    } catch (e) {
      const hErr = newHistory.map((t) => t.id === record.id ? { ...t, status: "failed" } : t);
      setTxHistory(hErr);
      localStorage.setItem("chainTradeTxs", JSON.stringify(hErr));
      if (e.code === 4001)                        toast("Transaction rejected.", "warn");
      else if (e.message?.includes("insufficient")) toast("Insufficient funds!", "error");
      else                                         toast("Error: " + e.message, "error");
    } finally {
      setSending(false);
    }
  };

  const formValid =
    form.productId && form.productName && form.quantity && form.price && form.receiver &&
    !Object.values(errors).some(Boolean);

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* HEADER */}
      <header style={S.header}>
        <div style={S.logo}>Chain<span style={{ color:"#64748b" }}>Trade</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          {networkName && (
            <span style={{ ...S.pill, ...(wrongNetwork ? S.pillRed : S.pillPurple) }}>
              {networkName}
            </span>
          )}
          {CONTRACT_ADDRESS && (
            <span style={S.contractPill} title={"Contract: " + CONTRACT_ADDRESS}>
              📄 {truncate(CONTRACT_ADDRESS)}
            </span>
          )}
          <button
            style={{ ...S.connectBtn, ...(address ? { borderColor:"#10b981", color:"#10b981" } : {}) }}
            onClick={address ? disconnectWallet : connectWallet}
          >
            {address ? truncate(address) : "Connect Wallet"}
          </button>
        </div>
      </header>

      <main style={S.main}>

        {/* ── NOT CONNECTED ── */}
        {!address && (
          <div style={S.wall}>
            <div style={{ fontSize:"3rem" }}>🔗</div>
            <div style={{ fontFamily:"monospace", fontSize:"1.4rem", color:"#e2e8f0" }}>Connect your wallet</div>
            <div style={{ color:"#64748b", maxWidth:"400px", lineHeight:1.7, fontSize:"0.9rem" }}>
              Connect MetaMask to send product transactions to the blockchain on Sepolia Testnet.
              {CONTRACT_ADDRESS
                ? <><br/><span style={{ color:"#a78bfa" }}>Contract loaded from .env ✓</span></>
                : <><br/><span style={{ color:"#f59e0b" }}>⚠ No contract address in .env — deploy first.</span></>}
            </div>
            <button style={S.ctaBtn} onClick={connectWallet}>Connect MetaMask</button>
            {!window.ethereum && (
              <div style={{ color:"#ef4444", fontFamily:"monospace", fontSize:"0.8rem",
                padding:"0.6rem 1rem", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"4px" }}>
                MetaMask not detected. Please install the extension.
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTED ── */}
        {address && (
          <>
            {/* Wrong network banner */}
            {wrongNetwork && (
              <div style={S.banner}>
                <span>⚠ Wrong network — switch to Sepolia Testnet (Chain ID {CHAIN_ID})</span>
                <button style={S.switchBtn} onClick={switchNetwork}>Switch Network</button>
              </div>
            )}

            {/* LEFT COLUMN */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

              {/* Wallet card */}
              <div style={S.card}>
                <div style={S.cardTitle}>// Wallet</div>
                <div style={S.addrBox}>{address}</div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.85rem" }}>
                  <span style={{ color:"#64748b" }}>Balance</span>
                  <span style={{ fontFamily:"monospace", fontSize:"1rem" }}>{balance ?? "…"}</span>
                </div>
              </div>

              {/* Contract info card */}
              <div style={{ ...S.card, borderColor: CONTRACT_ADDRESS ? "rgba(124,58,237,0.35)" : "rgba(245,158,11,0.3)" }}>
                <div style={S.cardTitle}>// Smart Contract</div>
                {CONTRACT_ADDRESS ? (
                  <>
                    <div style={{ fontFamily:"monospace", fontSize:"0.75rem", color:"#a78bfa",
                      wordBreak:"break-all", padding:"0.6rem 0.8rem",
                      background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px" }}>
                      {CONTRACT_ADDRESS}
                    </div>
                    <div style={{ fontSize:"0.7rem", color:"#64748b", marginTop:"0.5rem" }}>
                      Loaded from <code style={{ color:"#00e5ff" }}>.env → VITE_CONTRACT_ADDRESS</code>
                    </div>
                    <a href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer"
                      style={{ display:"inline-block", marginTop:"0.5rem", fontSize:"0.7rem", color:"#00e5ff" }}>
                      View on Etherscan ↗
                    </a>
                  </>
                ) : (
                  <div style={{ fontFamily:"monospace", fontSize:"0.75rem", color:"#f59e0b" }}>
                    ⚠ VITE_CONTRACT_ADDRESS not set in .env<br/>
                    <span style={{ color:"#64748b", fontSize:"0.7rem" }}>
                      Run: <code style={{ color:"#00e5ff" }}>npm run deploy:sepolia</code>
                    </span>
                  </div>
                )}
              </div>

              {/* Transaction Form */}
              <div style={S.card}>
                <div style={S.cardTitle}>// Product Transaction</div>
                <div style={S.grid2}>
                  {[
                    { name:"productId",   label:"Product ID",       placeholder:"PRD-001",  type:"text" },
                    { name:"productName", label:"Product Name",     placeholder:"Widget X", type:"text" },
                    { name:"quantity",    label:"Quantity",         placeholder:"10",       type:"number" },
                    { name:"price",       label:"Price / unit (ETH)",placeholder:"0.001",  type:"number" },
                  ].map(({ name, label, placeholder, type }) => (
                    <div key={name} style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
                      <label style={S.label}>{label}</label>
                      <input name={name} type={type} value={form[name]} onChange={handleChange}
                        placeholder={placeholder}
                        style={{ ...S.input, ...(errors[name] ? { borderColor:"#ef4444" } : {}) }} />
                      {errors[name] && <span style={{ fontSize:"0.7rem", color:"#ef4444" }}>{errors[name]}</span>}
                    </div>
                  ))}
                </div>

                {/* Receiver — full width */}
                <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem", marginTop:"1rem" }}>
                  <label style={S.label}>Receiver Address</label>
                  <input name="receiver" type="text" value={form.receiver} onChange={handleChange}
                    placeholder="0x..."
                    style={{ ...S.input, ...(errors.receiver ? { borderColor:"#ef4444" } : {}) }} />
                  {errors.receiver && <span style={{ fontSize:"0.7rem", color:"#ef4444" }}>{errors.receiver}</span>}
                </div>

                {/* Total */}
                <div style={S.totalBox}>
                  <span style={{ fontSize:"0.75rem", color:"#64748b", fontFamily:"monospace" }}>Total Value</span>
                  <span style={{ fontFamily:"monospace", fontSize:"1.3rem", color:"#00e5ff" }}>{total()} ETH</span>
                </div>

                {gasInfo && (
                  <div style={S.gasBox}>
                    <span>⛽ Estimated Gas</span><span>{gasInfo}</span>
                  </div>
                )}

                {signature && (
                  <div style={S.sigBox}>
                    <div style={{ fontFamily:"monospace", fontSize:"0.65rem", color:"#64748b", marginBottom:"0.4rem" }}>✓ Signed Message</div>
                    <div style={{ fontFamily:"monospace", fontSize:"0.63rem", color:"#a78bfa", wordBreak:"break-all", lineHeight:1.5 }}>{signature}</div>
                  </div>
                )}

                <div style={{ display:"flex", gap:"1rem", marginTop:"1.25rem" }}>
                  <button style={{ ...S.btn, ...S.btnSign }} onClick={signTransaction} disabled={!formValid || signing}>
                    {signing ? "⏳ Signing…" : "Sign Tx"}
                  </button>
                  <button style={{ ...S.btn, ...S.btnSend }} onClick={sendTransaction} disabled={!formValid || wrongNetwork || sending}>
                    {sending ? "⏳ Sending…" : "Send Tx"}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — History */}
            <div style={{ ...S.card, height:"fit-content", position:"sticky", top:"80px", maxHeight:"85vh", overflowY:"auto" }}>
              <div style={S.cardTitle}>// Transaction History</div>
              {txHistory.length === 0 ? (
                <div style={{ textAlign:"center", padding:"2rem", fontFamily:"monospace", fontSize:"0.75rem", color:"#64748b" }}>
                  No transactions yet.<br/>Send your first one →
                </div>
              ) : (
                txHistory.map((tx) => (
                  <div key={tx.id} style={S.txItem}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                      <span style={{ fontFamily:"monospace", fontSize:"0.8rem" }}>{tx.product}</span>
                      <span style={{ ...S.badge, ...badgeStyle(tx.status) }}>{tx.status}</span>
                    </div>
                    <div style={{ fontSize:"0.72rem", color:"#64748b" }}>{tx.amount} → {tx.receiver}</div>
                    {tx.hash
                      ? <div style={{ fontFamily:"monospace", fontSize:"0.65rem", color:"#64748b", marginTop:"0.3rem" }}>
                          {truncate(tx.hash, 14)}{" "}
                          <a href={`${EXPLORER_URL}/tx/${tx.hash}`} target="_blank" rel="noreferrer" style={{ color:"#00e5ff" }}>
                            ↗ Etherscan
                          </a>
                        </div>
                      : <div style={{ fontFamily:"monospace", fontSize:"0.65rem", color:"#64748b", marginTop:"0.3rem" }}>Awaiting hash…</div>
                    }
                    <div style={{ fontSize:"0.62rem", color:"#64748b", opacity:0.5, marginTop:"0.3rem" }}>{tx.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* TOASTS */}
      <div style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", display:"flex", flexDirection:"column", gap:"0.5rem", zIndex:999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...S.toast, ...toastStyle(t.type) }}>
            <span>{{ success:"✓", error:"✗", warn:"⚠", info:"ℹ" }[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  header:      { position:"sticky", top:0, zIndex:100, background:"rgba(10,10,15,0.9)",
                 backdropFilter:"blur(12px)", borderBottom:"1px solid #1e1e2e",
                 padding:"0 2rem", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:        { fontFamily:"Space Mono, monospace", fontSize:"1.1rem", color:"#00e5ff" },
  pill:        { fontFamily:"monospace", fontSize:"0.62rem", padding:"0.25rem 0.6rem",
                 borderRadius:"100px", border:"1px solid" },
  pillPurple:  { borderColor:"#7c3aed", color:"#a78bfa" },
  pillRed:     { borderColor:"#ef4444", color:"#ef4444" },
  contractPill:{ fontFamily:"monospace", fontSize:"0.62rem", padding:"0.25rem 0.7rem",
                 borderRadius:"100px", border:"1px solid rgba(124,58,237,0.4)",
                 color:"#a78bfa", background:"rgba(124,58,237,0.08)", cursor:"default" },
  connectBtn:  { fontFamily:"monospace", fontSize:"0.73rem", padding:"0.45rem 1.1rem",
                 border:"1px solid #00e5ff", background:"transparent", color:"#00e5ff",
                 cursor:"pointer", borderRadius:"4px" },
  main:        { maxWidth:"1200px", margin:"0 auto", padding:"2rem 1.5rem",
                 display:"grid", gridTemplateColumns:"1fr 380px", gap:"1.5rem",
                 position:"relative", zIndex:1 },
  wall:        { gridColumn:"1/-1", display:"flex", flexDirection:"column", alignItems:"center",
                 justifyContent:"center", minHeight:"65vh", gap:"1.5rem", textAlign:"center" },
  ctaBtn:      { fontFamily:"monospace", fontSize:"0.8rem", padding:"0.85rem 2.2rem",
                 background:"linear-gradient(135deg,#7c3aed,#0ea5e9)", color:"#fff",
                 border:"none", borderRadius:"4px", cursor:"pointer" },
  banner:      { gridColumn:"1/-1", padding:"0.75rem 1.2rem",
                 background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                 borderRadius:"6px", display:"flex", alignItems:"center",
                 justifyContent:"space-between", fontSize:"0.85rem", color:"#ef4444" },
  switchBtn:   { fontFamily:"monospace", fontSize:"0.7rem", padding:"0.4rem 0.9rem",
                 background:"rgba(239,68,68,0.2)", border:"1px solid #ef4444",
                 color:"#ef4444", borderRadius:"4px", cursor:"pointer" },
  card:        { background:"#16161f", border:"1px solid #1e1e2e", borderRadius:"8px", padding:"1.5rem" },
  cardTitle:   { fontFamily:"monospace", fontSize:"0.68rem", letterSpacing:"0.1em",
                 color:"#00e5ff", textTransform:"uppercase", marginBottom:"1.2rem" },
  addrBox:     { fontFamily:"monospace", fontSize:"0.78rem", color:"#00e5ff", wordBreak:"break-all",
                 padding:"0.7rem 0.85rem", background:"rgba(0,229,255,0.05)",
                 border:"1px solid rgba(0,229,255,0.15)", borderRadius:"4px", marginBottom:"0.75rem" },
  grid2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" },
  label:       { fontSize:"0.68rem", fontFamily:"monospace", color:"#64748b",
                 textTransform:"uppercase", letterSpacing:"0.05em" },
  input:       { background:"#111118", border:"1px solid #1e1e2e", color:"#e2e8f0",
                 padding:"0.62rem 0.85rem", borderRadius:"4px", fontSize:"0.9rem",
                 outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" },
  totalBox:    { marginTop:"1rem", padding:"0.9rem 1rem",
                 background:"linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,229,255,0.1))",
                 border:"1px solid #1e1e2e", borderRadius:"4px",
                 display:"flex", justifyContent:"space-between", alignItems:"center" },
  gasBox:      { marginTop:"0.75rem", padding:"0.6rem 0.85rem",
                 background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)",
                 borderRadius:"4px", fontFamily:"monospace", fontSize:"0.73rem", color:"#f59e0b",
                 display:"flex", justifyContent:"space-between", gap:"1rem" },
  sigBox:      { marginTop:"0.75rem", padding:"0.75rem",
                 background:"rgba(124,58,237,0.07)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px" },
  btn:         { flex:1, padding:"0.72rem", border:"none", borderRadius:"4px",
                 fontFamily:"monospace", fontSize:"0.73rem", letterSpacing:"0.05em",
                 cursor:"pointer", textTransform:"uppercase" },
  btnSign:     { background:"rgba(124,58,237,0.2)", border:"1px solid #7c3aed", color:"#a78bfa" },
  btnSend:     { background:"linear-gradient(135deg,#7c3aed,#0ea5e9)", color:"#fff" },
  txItem:      { padding:"0.85rem", background:"#111118", border:"1px solid #1e1e2e",
                 borderRadius:"6px", marginBottom:"0.75rem" },
  badge:       { fontFamily:"monospace", fontSize:"0.58rem", padding:"0.18rem 0.5rem",
                 borderRadius:"100px", textTransform:"uppercase", border:"1px solid" },
  toast:       { padding:"0.72rem 1.1rem", borderRadius:"6px", fontFamily:"monospace",
                 fontSize:"0.73rem", maxWidth:"360px", display:"flex", alignItems:"center", gap:"0.6rem" },
};

const badgeStyle = (s) => ({
  pending: { background:"rgba(245,158,11,0.15)", color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)" },
  success: { background:"rgba(16,185,129,0.15)",  color:"#10b981", borderColor:"rgba(16,185,129,0.3)" },
  failed:  { background:"rgba(239,68,68,0.15)",   color:"#ef4444", borderColor:"rgba(239,68,68,0.3)" },
}[s] || {});

const toastStyle = (t) => ({
  success: { background:"rgba(16,185,129,0.15)",  border:"1px solid #10b981", color:"#10b981" },
  error:   { background:"rgba(239,68,68,0.15)",   border:"1px solid #ef4444", color:"#ef4444" },
  warn:    { background:"rgba(245,158,11,0.12)",  border:"1px solid #f59e0b", color:"#f59e0b" },
  info:    { background:"rgba(0,229,255,0.1)",    border:"1px solid #00e5ff", color:"#00e5ff" },
}[t] || {});
