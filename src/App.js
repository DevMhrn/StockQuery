import React from 'react';
import Header from './components/Header';
import './styles/App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QueryPage from './components/QueryPage';
function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<QueryPage />} />
        </Routes>
        
      </Router>
      
    </div>
  );
}

export default App;
