import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import TrimVideo from './components/TrimVideo';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/trim-video">Trim Video</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/trim-video" element={<TrimVideo />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
