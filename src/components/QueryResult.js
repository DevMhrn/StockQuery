import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import SaveScreenPopup from './SaveScreenPopup';
import '../styles/QueryResult.css';

function QueryResult({ query }) {
  console.log('QueryResult:', query);
  const cleanQuery = query.replace(/\r?\n|\r/g, ' ').trim();
  console.log('Clean Query:', cleanQuery);

  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: 'Market Capitalization (B)',
    direction: 'ascending',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedScreens, setSavedScreens] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [removedColumns, setRemovedColumns] = useState([]);

  const columnDisplayNames = {
    'Current Ratio': 'Curr. Ratio',
    'Debt-to-Equity Ratio': 'Debt/Equity',
    'Dividend Yield': 'Div. Yield(%)',
    'EPS Growth': 'EPS Growth(%)',
    'Gross Margin': 'Gross Margin(%)',
    'Market Capitalization': 'Market Cap',
    'P/E Ratio': 'P/E Ratio',
    'ROE': 'ROE(%)',
    'Revenue Growth': 'Revenue Growth(%)',
    'Ticker': 'Company Names',
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedScreens')) || [];
    setSavedScreens(saved);
    setCurrentPath(query);

    fetch('/stockData.xlsx')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Excel file loaded successfully:', jsonData);
        setStockData(jsonData);
        setVisibleColumns(Object.keys(jsonData[0] || {}));
      })
      .catch((error) => console.error('Error loading the Excel file:', error));
  }, [query]);

  const applyQuery = (data, query) => {
    const conditions = query.split('AND').map((cond) => cond.trim());
    return data.filter((item) => {
      return conditions.every((cond) => {
        const cleanedCond = cond.trim();
        const match = cleanedCond.match(/(.*?)\s*([><=]+)\s*(.*)/);
        if (!match) return false;

        const field = match[1].trim();
        const operator = match[2].trim();
        const value = parseFloat(match[3].trim());
        const itemValue = parseFloat(item[field]);

        if (isNaN(itemValue) || isNaN(value)) return false;

        switch (operator) {
          case '>':
            return itemValue > value;
          case '<':
            return itemValue < value;
          case '>=':
            return itemValue >= value;
          case '<=':
            return itemValue <= value;
          case '==':
            return itemValue === value;
          default:
            return false;
        }
      });
    });
  };

  useEffect(() => {
    const filtered = applyQuery(stockData, cleanQuery);
    setFilteredData(filtered);
  }, [stockData, cleanQuery]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      return aValue < bValue ? (sortConfig.direction === 'ascending' ? -1 : 1) :
             aValue > bValue ? (sortConfig.direction === 'ascending' ? 1 : -1) : 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction: prev.key === column && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (count) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleColumnRemove = (column) => {
    setRemovedColumns([...removedColumns, column]);
    setVisibleColumns(visibleColumns.filter((col) => col !== column));
  };

  const handleColumnAdd = (column) => {
    setRemovedColumns(removedColumns.filter((col) => col !== column));
    setVisibleColumns([...visibleColumns, column]);
  };

  const handleSaveScreen = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveModal = () => setIsModalOpen(false);

  const handleDeleteScreen = () => {
    const updatedScreens = savedScreens.filter(screen => screen.link !== currentPath);
    localStorage.setItem('savedScreens', JSON.stringify(updatedScreens));
    setSavedScreens(updatedScreens);
  };

  return (
    <div className="query-result-container">
      <div className="query-result-header">
        <h2 className="query-title">Query Results</h2>
        <div className="query-actions">
          <button className="option-button" onClick={toggleEditMode} style={{ marginRight: '10px' }}>
            {isEditMode ? 'Exit Edit Mode' : 'Edit Columns'}
          </button>
          {savedScreens.some(screen => screen.link === currentPath) && (
            <button className="delete-button" onClick={handleDeleteScreen}>Delete Screen</button>
          )}
          <button className="save-button" onClick={handleSaveScreen}>Save Screen</button>
        </div>
      </div>

      {isEditMode ? (
        <div className="edit-columns-bar">
          {visibleColumns.map((col) => (
            <span key={col} className="column-node">
              {columnDisplayNames[col] || col}
              <FaTimes className="remove-icon" onClick={() => handleColumnRemove(col)} />
            </span>
          ))}
          {removedColumns.map((col) => (
            <span key={col} className="column-node removed" onClick={() => handleColumnAdd(col)}>
              {columnDisplayNames[col] || col}
            </span>
          ))}
        </div>
      ) : (
        <>
          <div className="result-summary">
            <p>Total Stocks: {sortedData.length}</p>
            {sortedData.length > 0 && (
              <div className="result-options">
                <button className="option-button">Industry</button>
                <button className="option-button">Export</button>
                
              </div>
            )}
          </div>

          {sortedData.length > 0 ? (
            <div className="query-table-container">
              <table className="query-table">
                <thead>
                  <tr className="table-header">
                    <th>S.No.</th>
                    {visibleColumns.map((key) => (
                      <th key={key} onClick={() => handleSort(key)} title={key}>
                        {columnDisplayNames[key] || key}
                        {sortConfig.key === key &&
                          (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentStocks.map((stock, index) => (
                    <tr key={index} className="table-row">
                      <td>{indexOfFirstItem + index + 1}</td>
                      {visibleColumns.map((col, idx) => (
                        <td key={idx}>{stock[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Total stocks are zero.</p>
          )}
        </>
      )}

        {sortedData.length > 0 && (
        <div className="pagination">
            <div className="pagination-controls">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                <FaArrowLeft /> Previous
            </button>
            <span className="page-info">
                Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next <FaArrowRight />
            </button>
            </div>

            <div className="rows-per-page">
            <span>Rows per page:</span>
            <div className="rows-buttons">
                {['10', '25', '50', '100'].map((value) => (
                <button
                    key={value}
                    className={`page-button ${itemsPerPage === Number(value) ? 'active' : ''}`}
                    onClick={() => handleRowsPerPageChange(Number(value))}
                >
                    {value}
                </button>
                ))}
            </div>
            </div>
        </div>
        )}



      <SaveScreenPopup isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveModal} />
    </div>
  );
}

export default QueryResult;
