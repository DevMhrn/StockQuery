import React, { useState } from 'react';
import QueryForm from './QueryForm';
import QueryResult from './QueryResult';
import '../styles/QueryPage.css';

function QueryPage() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleRunQuery = (newQuery) => {
    setQuery(newQuery);
    setShowResults(true); // Show the QueryResult component
  };

  return (
    <div className={`query-page-wrapper ${showResults ? 'show-results' : ''}`}>
      {showResults ? (
        <>
          <QueryResult query={query} />
          <QueryForm onRunQuery={handleRunQuery} query={query} showResults={false} />
        </>
      ) : (
        <QueryForm onRunQuery={handleRunQuery} query={query} showResults={showResults} />
      )}
    </div>
  );
}

export default QueryPage;
