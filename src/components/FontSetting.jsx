import React from 'react';
import './home.css';

const FontSettings = ({ settings, onInputChange, fontFamilies, dualSpeakerMode }) => (
  <div className="font-settings">
    <div className="form-group">
      <label>Font Family:</label>
      <select name="fontFamily" value={settings.fontFamily} onChange={onInputChange} className="form-control">
        {fontFamilies.map((font) => (
          <option key={font} value={font}>{font}</option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label>Font Size:</label>
      <input type="number" name="fontSize" value={settings.fontSize} onChange={onInputChange} className="form-control" />
    </div>
    {!dualSpeakerMode && (
      <div className="form-group">
        <label>Font Color:</label>
        <input type="color" name="fontColor" value={settings.fontColor} onChange={onInputChange} className="form-control color-input" />
      </div>
    )}
    <div className="form-group">
      <label>Outline:</label>
      <input type="number" name="outline" value={settings.outline} onChange={onInputChange} className="form-control" />
    </div>
    <div className="form-group">
      <label>Outline Color:</label>
      <input type="color" name="outlineColor" value={settings.outlineColor} onChange={onInputChange} className="form-control color-input" />
    </div>
    <div className="form-group">
      <label>Shadow:</label>
      <input type="number" name="shadow" value={settings.shadow} onChange={onInputChange} className="form-control" />
    </div>
  </div>
);

export default FontSettings;
