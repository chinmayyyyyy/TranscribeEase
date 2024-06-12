import React from 'react';
import './home.css';


const DualSpeakerSettings = ({ settings, onInputChange }) => (
  <div>
    <div>
      <label>Speaker 1 Font Color:</label>
      <input type="color" name="speaker1FontColor" value={settings.speaker1FontColor} onChange={onInputChange} />
    </div>
    <div>
      <label>Speaker 2 Font Color:</label>
      <input type="color" name="speaker2FontColor" value={settings.speaker2FontColor} onChange={onInputChange} />
    </div>
  </div>
);

export default DualSpeakerSettings;
