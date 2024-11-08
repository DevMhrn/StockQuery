import React, { useState, useEffect } from 'react';
import '../styles/QueryForm.css';

function QueryForm({ onRunQuery, query }) {
  const [localQuery, setLocalQuery] = useState(query);
  const [onlySepResults, setOnlySepResults] = useState(false);

  // Update localQuery whenever the query prop changes
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleRunQueryClick = () => {
    const processedQuery = localQuery.trim();
    onRunQuery(processedQuery);
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
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
          <div className="query-example-box">
            <p className="query-example">
              Custom query example<br /><br />
              Market Capitalization {'>'} 100 AND<br />
              P/E Ratio{'<'} 15 AND<br />
              ROE{'>'} 22%<br /><br />
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
