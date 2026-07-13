import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function WalletButton() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasProvider, setHasProvider] = useState(false);


  useEffect(() => {
    const checkProvider = () => {
      const providerExists = !!window.ethereum;
      setHasProvider(providerExists);
    };

    checkProvider();
  }, []);

  const fetchBalanceAndNetwork = async (provider, address) => {
    try {
      const bal = await provider.getBalance(address);
      const net = await provider.getNetwork();
      
      setBalance(ethers.formatEther(bal).slice(0, 6));
      setNetwork(net.name || `#${net.chainId}`);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!hasProvider) return;

    const checkConnection = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        
        if (accounts.length > 0) {
          const address = accounts[0];
          setAccount(address);
          await fetchBalanceAndNetwork(provider, address);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkConnection();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const address = accounts[0];
        setAccount(address);
        await fetchBalanceAndNetwork(provider, address);
      } else {
        setAccount(null);
        setBalance(null);
        setNetwork(null);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [hasProvider]);

  const connectWallet = async () => {
    if (!window.ethereum) return;

    setIsLoading(true);
    setError("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setAccount(address);
      await fetchBalanceAndNetwork(provider, address);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setNetwork(null);
  };

  // Install MetaMask Fallback UI
  if (!hasProvider) {
    return (
      <div style={{
        background: "#1e2937",
        padding: "24px",
        borderRadius: "12px",
        maxWidth: "420px",
        margin: "20px auto",
        textAlign: "center",
        border: "1px solid #334155"
      }}>
        <h3 style={{ margin: "0 0 12px 0", color: "#f87171" }}>
          MetaMask Not Detected
        </h3>
        <p style={{ margin: "0 0 20px 0", color: "#cbd5e1" }}>
          Please install MetaMask to connect your wallet.
        </p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#f59e0b",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
            fontWeight: "600"
          }}
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  // Connected State
  if (account) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "12px",
        marginTop: "20px"
      }}>
        <div style={{ 
          background: "#1e2937", 
          padding: "16px 24px", 
          borderRadius: "12px",
          fontFamily: "monospace",
          textAlign: "center",
          border: "1px solid #334155",
          minWidth: "280px"
        }}>
          <div><strong>{`${account.slice(0, 6)}...${account.slice(-4)}`}</strong></div>
          {balance && <div style={{fontSize:"0.9rem", marginTop:"4px"}}>Balance: {balance} ETH</div>}
          {network && <div style={{fontSize:"0.85rem", color:"#94a3b8"}}>Network: {network}</div>}
        </div>

        <button 
          className="wallet-btn"
          onClick={disconnect}
          style={{ background: "#ef4444", width: "fit-content" }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Connect Button
  return (
    <div style={{ marginTop: "20px" }}>
      {error && <p style={{ color: "#f87171", marginBottom: "12px" }}>{error}</p>}
      
      <button 
        className="wallet-btn" 
        onClick={connectWallet}
        disabled={isLoading}
        style={{ minWidth: "200px" }}
      >
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  );
}