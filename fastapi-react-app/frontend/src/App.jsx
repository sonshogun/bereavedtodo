// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from the FastAPI endpoint
    fetch('http://localhost:8000/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{message ? `Backend says: "${message}"` : 'Loading message...'}</p>
      </header>
    </div>
  );
}

export default App;
