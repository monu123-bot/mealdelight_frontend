import React, { useState } from 'react';
import "./style/history.css";

const History = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // In a real application, this would be an API call
    // For now, we'll simulate a fetch with a timeout
    setTimeout(() => {
      // Check if the phone number matches a pattern for demo
      const isValidPhoneForDemo = /^\+?\d{10,15}$/.test(phoneNumber.replace(/[- ]/g, ''));
      
      if (!isValidPhoneForDemo) {
        setError('No customer found with this phone number');
        setTransactions([]);
      } else {
        // Generate mock transaction data
        const mockTransactions = Array(Math.floor(Math.random() * 15) + 5).fill().map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - index * Math.floor(Math.random() * 7 + 1));
          
          const types = ['Purchase', 'Refund', 'Subscription', 'Renewal'];
          const statuses = ['Completed', 'Pending', 'Failed', 'Cancelled'];
          
          return {
            id: Math.floor(Math.random() * 100000) + 1,
            date: date.toLocaleDateString(),
            type: types[Math.floor(Math.random() * types.length)],
            amount: `$${(Math.random() * 500 + 10).toFixed(2)}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            details: `Transaction details for order #${Math.floor(Math.random() * 10000) + 1000}`
          };
        });
        
        setTransactions(mockTransactions);
      }
      
      setIsLoading(false);
      setHasSearched(true);
    }, 1000);
  };

  return (
    <div className="history-container">
      <h2>Customer Transaction History</h2>
      
      <form className="search-form" onSubmit={handleSearch}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter customer phone number"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="phone-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
      
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : hasSearched && transactions.length > 0 ? (
        <div className="results-container">
          <h3>Transaction History for {phoneNumber}</h3>
          
          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="no-results">No transactions found</div>
      ) : (
        <div className="instructions">
          <p>Enter a customer's phone number to view their transaction history.</p>
          <p className="tip">Tip: For this demo, enter a phone number with 10-15 digits to see sample data.</p>
        </div>
      )}
    </div>
  );
};

export default History;