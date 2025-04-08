import { useEffect, useState } from "react";
import { ethers, parseEther, formatEther } from 'ethers';
import CONTRACT_ABI from './abi.json';
import './App.css'; // Import the CSS file

const CONTRACT_ADDRESS = "0xB7F9415d40B933204FB3fCE5C5941A84bab094Bb";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [holders, setHolders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const prov = new ethers.BrowserProvider(window.ethereum);
          const signerObj = await prov.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerObj);
          
          setProvider(prov);
          setSigner(signerObj);
          setContract(contract);
          
          const accs = await prov.send("eth_requestAccounts", []);
          setAccount(accs[0]);
          
          const balance = await contract.balanceOf(accs[0]);
          setBalance(formatEther(balance));
          
          const holders = await contract.getAllHolders();
          setHolders(holders);
          
          const txnCount = await contract.getTransactionCount();
          const txns = [];
          
          for (let i = 0; i < txnCount; i++) {
            const txn = await contract.getTransaction(i);
            txns.push(txn);
          }
          
          setTransactions(txns);
        } catch (error) {
          console.error("Initialization error:", error);
        }
      } else {
        console.log("Ethereum provider not detected");
      }
    };
    
    init();
  }, []);
  
  const transferTokens = async (to, amount) => {
    try {
      const tx = await contract.transfer(to, parseEther(amount));
      await tx.wait();
      alert("Transfer successful!");
      
      // Refresh balances after transfer
      const balance = await contract.balanceOf(account);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed: " + error.message);
    }
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>YashToken Dashboard</h1>
          <div className="account-info">
            <div className="account-item">
              <span className="label">Connected Account:</span>
              <span className="value">{account}</span>
            </div>
            <div className="account-item">
              <span className="label">Balance:</span>
              <span className="value">{balance} YASH</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>All Token Holders</h2>
          <ul className="holders-list">
            {holders.length > 0 ? holders.map((holder, i) => (
              <li key={i} className="holder-item">{holder}</li>
            )) : <p className="empty-message">No holders found</p>}
          </ul>
        </div>
        
        <div className="dashboard-section">
          <h2>Transaction History</h2>
          {transactions.length > 0 ? (
            <div className="transactions-list">
              {transactions.map((txn, i) => (
                <div key={i} className="transaction-card">
                  <div className="transaction-row">
                    <span className="transaction-label">From:</span>
                    <span className="transaction-value">{txn.from}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="transaction-label">To:</span>
                    <span className="transaction-value">{txn.to}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="transaction-label">Amount:</span>
                    <span className="transaction-value">{formatEther(txn.amount)} YASH</span>
                  </div>
                  <div className="transaction-row">
                    <span className="transaction-label">Time:</span>
                    <span className="transaction-value">{new Date(Number(txn.timestamp) * 1000).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No transactions found</p>
          )}
        </div>
        
        <div className="dashboard-section">
          <h2>Transfer YASH</h2>
          <div className="transfer-form">
            <div className="form-group">
              <input 
                id="recipient" 
                placeholder="Recipient Address" 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <input 
                id="amount" 
                placeholder="Amount" 
                type="number" 
                min="0" 
                step="0.01" 
                className="form-input" 
              />
            </div>
            <button 
              className="transfer-button"
              onClick={() => {
                const recipient = document.getElementById('recipient').value;
                const amount = document.getElementById('amount').value;
                if (recipient && amount) {
                  transferTokens(recipient, amount);
                } else {
                  alert("Please enter recipient address and amount");
                }
              }}
            >
              Send YASH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;