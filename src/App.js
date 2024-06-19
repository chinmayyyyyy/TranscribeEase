import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import TrimVideo from './components/TrimVideo';
import AddSound from './components/AddSound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
                <Link to="/">
                    <div>
                    <img src={require('./Assets/video-call.png')} alt=""/>
                      <p>Transcribe</p>
                    </div>
                </Link>
            </li>
            <li>
              <Link to="/trim-video">
              <div>
                    <img src={require('./Assets/video-editing.png')} alt=""/>
                      <p>Trim Video</p>
              </div>
              </Link>
            </li>
            <li>
              <Link to="/add-sound">
              <div>
                    <img src={require('./Assets/movie-player.png')} alt=""/>
                      <p>Add Sound</p>
              </div>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="main-content">
          <Routes>
            <Route path="/trim-video" element={<TrimVideo />} />
            <Route path="/add-sound" element={<AddSound />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
