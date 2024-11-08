import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/SaveScreenPopup.css';

function SaveScreenPopup({ isOpen, data, onClose }) {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (fileName) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      setFileName(''); // Clear file name after saving
      onClose(); // Close modal
    } else {
      setError('Please enter a file name.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup">
        <h2>Save Screen</h2>
        <input
          type="text"
          placeholder="Enter file name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <div className="popup-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default SaveScreenPopup;
