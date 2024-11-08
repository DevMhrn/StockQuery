import React, { useState } from 'react';
import '../styles/QueryForm.css';

function QueryForm({ onRunQuery }) {
  const [query, setQuery] = useState('');
  const [onlySepResults, setOnlySepResults] = useState(false);

  const handleRunQueryClick = () => {
    const processedQuery = query.trim();
    onRunQuery(processedQuery);
    // No need to clear the query, so it remains in the text area
  };

  return (
    <div className="query-container">
      <div className="query-box">
        <p className="query-title-box">Create a Search Query</p>
        <p className="query-subtitle">Query</p>
        <div className="query-input-container">
          <textarea
            placeholder="Enter your search query..."
            className="query-textarea"
            rows="6"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="query-example-box">
            <p className="query-example">
              Custom query example<br /><br />
              Market capitalization {'>'} 500 AND<br />
              Price to earning {'<'} 15 AND<br />
              Return on capital employed {'>'} 22%<br /><br />
            </p>
            <p className="query-guide">Detailed guide on creating screens</p>
          </div>
        </div>

        {/* Checkbox for filtering */}
        <div className="query-filter">
          <label>
            <input
              type="checkbox"
              checked={onlySepResults}
              onChange={(e) => setOnlySepResults(e.target.checked)}
            />
            Only companies with Sep 2024 results
          </label>
        </div>

        <div className="query-buttons">
          <button className="query-button" onClick={handleRunQueryClick}>
            RUN THIS QUERY
          </button>
          <button className="query-button show-all-ratios-button">
            SHOW ALL RATIOS
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueryForm;
