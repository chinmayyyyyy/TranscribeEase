import React from 'react';
import './home.css';


const FontSettings = ({ settings, onInputChange, fontFamilies, dualSpeakerMode }) => (
  <div>
    <div>
      <label>Font Family:</label>
      <select name="fontFamily" value={settings.fontFamily} onChange={onInputChange}>
        {fontFamilies.map((font) => (
          <option key={font} value={font}>{font}</option>
        ))}
      </select>
    </div>
    <div>
      <label>Font Size:</label>
      <input type="number" name="fontSize" value={settings.fontSize} onChange={onInputChange} />
    </div>
    {!dualSpeakerMode && (
      <div>
        <label>Font Color:</label>
        <input type="color" name="fontColor" value={settings.fontColor} onChange={onInputChange} />
      </div>
    )}
    <div>
      <label>Outline:</label>
      <input type="number" name="outline" value={settings.outline} onChange={onInputChange} />
    </div>
    <div>
      <label>Outline Color:</label>
      <input type="color" name="outlineColor" value={settings.outlineColor} onChange={onInputChange} />
    </div>
    <div>
      <label>Shadow:</label>
      <input type="number" name="shadow" value={settings.shadow} onChange={onInputChange} />
    </div>
    <div>
      <label>Background Color:</label>
      <input type="color" name="backgroundColor" value={settings.backgroundColor} onChange={onInputChange} />
    </div>
    <div>
      <label>Orientation:</label>
      <select name="orientation" value={settings.orientation} onChange={onInputChange}>
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
    </div>
  </div>
);

export default FontSettings;
