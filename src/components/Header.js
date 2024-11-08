import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      
      <nav className="nav">
        <div className="nav-links">
          <div className="logo">screener</div>
          <a href="#" className="nav-item">Feed</a>
          <a href="#" className="nav-item">Screens</a>
          
          <div className="dropdown">
            <a href="#" className="nav-item">Tools</a>
            <div className="dropdown-content">
              <a href="#">Tool 1</a>
              <a href="#">Tool 2</a>
              <a href="#">Tool 3</a>
            </div>
          </div>
        </div>
        
        <div className="right-section">
          <input type="text" placeholder="Search for a company" className="search-bar" />
          <div className="profile">DEBASHIS</div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
