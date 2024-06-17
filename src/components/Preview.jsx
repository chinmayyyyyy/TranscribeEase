import React from 'react';
import './home.css';
import { Player } from 'video-react';

const Preview = ({videoUrl, settings, onInputChange, previewVideoUrl, previewStyle, videoStyle, dualSpeakerMode, speaker1FontColor, speaker2FontColor }) => (
  <div>
    <h3 style={{textAlign : 'center'}}>Preview:</h3>
    <div className="preview-box" style={videoStyle}>
      {previewVideoUrl && (
        <Player
          src={previewVideoUrl}
          fluid={false}
          width={640}
          height={360}
        />
      )}
      <div className="preview-text" style={previewStyle}>
        {dualSpeakerMode ? (
          <>
            <span style={{ color: speaker1FontColor }}>Speaker 1: This is a preview of your subtitle text</span><br />
            <span style={{ color: speaker2FontColor }}>Speaker 2: This is a preview of your subtitle text</span>
          </>
        ) : (
          <span>This is a preview of your subtitle text</span>
        )}
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Background Color:</label>
        <input type="color" name="backgroundColor" value={settings.backgroundColor} onChange={onInputChange} className="form-control color-input" />
      </div>
      <div className="form-group">
        <label>Orientation:</label>
        <select name="orientation" value={settings.orientation} onChange={onInputChange} className="form-control">
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>
    </div>
    {videoUrl && (
          <div>
            <h2>Processed Video:</h2>
            <video controls src={videoUrl} style={{ width: '100%' }} />
          </div>
        )}
  </div>
);

export default Preview;
