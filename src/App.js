import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import WordMemory from './game/WordMemory';
import PinCrack from './game/PinCrack';
import SpeedTyping from './game/SpeedTyping';
import Mazer from './game/Mazer';
import RoofRunning from './game/RoofRunning';
import './App.css'; // Assuming you have a separate CSS file for styling

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <nav className={`top-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-toggle" onClick={toggleMenu}>
          Menu
        </div>
        <div className={`menu-items ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="menu-item" onClick={toggleMenu}>Word Memory</Link>
          <Link to="/pin-crack" className="menu-item" onClick={toggleMenu}>Pin Crack</Link>
          <Link to="/speed-typing" className="menu-item" onClick={toggleMenu}>Speed Typing</Link>
          <Link to="/mazer" className="menu-item" onClick={toggleMenu}>Mazer</Link>
          <Link to="/roof-running" className="menu-item" onClick={toggleMenu}>Roof Running</Link>
          <div className="github-link" onClick={toggleMenu}>
            <a href="https://github.com/OgPaine/psychic-octo-succotash">
              <FontAwesomeIcon icon={faGithub} /> GitHub Repository
            </a>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<WordMemory />} />
        <Route path="/pin-crack" element={<PinCrack />} />
        <Route path="/speed-typing" element={<SpeedTyping />} />
        <Route path="/mazer" element={<Mazer />} />
        <Route path="/roof-running" element={<RoofRunning />} />
      </Routes>
    </Router>
  );
}

export default App;
