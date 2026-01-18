import React, { useState } from 'react';
import DynamicForm from './DynamicForm';
import axios from 'axios';
import './index.css';

function App() {
  const [url, setUrl] = useState('http://localhost:3000/');
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setFormData(null);
    setSubmittedData(null);

    try {
      const response = await axios.get(url);
      const data = response.data;
      
      // Validate that the response is an object
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('Response must be a JSON object');
      }

      setFormData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch data. Please check the URL and ensure CORS is enabled if needed.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
    console.log('Form submitted with data:', data);
    alert('Form submitted! Check console for submitted data.');
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Dynamic Form Generator</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Enter a URL to fetch JSON data and generate a dynamic form based on the response structure.
        </p>

        <div className="input-group">
          <label htmlFor="url-input">API URL:</label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:3000/"
          />
        </div>

        <button 
          onClick={fetchData} 
          disabled={loading || !url.trim()}
        >
          {loading ? 'Fetching...' : 'Fetch & Generate Form'}
        </button>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading">Loading data...</div>
        )}
      </div>

      {formData && (
        <div className="card">
          <h2>Dynamic Form</h2>
          <DynamicForm formData={formData} onSubmit={handleFormSubmit} />
        </div>
      )}

      {submittedData && (
        <div className="card">
          <h2>Submitted Data</h2>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;

