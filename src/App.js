import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons'; // Correct import for faGithub

import WordMemory from './game/WordMemory';
import PinCrack from './game/PinCrack';
import SpeedTyping from './game/SpeedTyping';
import Mazer from './game/Mazer';
import Terminal from './game/Terminal';



function App() {
  return (
    <Router>
      <nav className="top-menu flex justify-between w-full">
        <div>
          <Link to="/" className="menu-item">Word Memory</Link>
          <Link to="/pin-crack" className="menu-item">Pin Crack</Link>
          <Link to="/speed-typing" className="menu-item">Speed Typing</Link>
          <Link to="/mazer" className="menu-item">Mazer</Link>
        </div>
        <div className="menu-right">
          <a href="https://github.com/OgPaine/psychic-octo-succotash" className="menu-item github-link">
            <FontAwesomeIcon icon={faGithub} /> GitHub Repository
          </a>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<WordMemory />} />
        <Route path="/pin-crack" element={<PinCrack />} />
        <Route path="/speed-typing" element={<SpeedTyping />} />
        <Route path="/mazer" element={<Mazer />} />
      </Routes>
    </Router>
  );
}

export default App;
