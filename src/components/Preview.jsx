import React from 'react';
import './home.css';


const Preview = ({ previewStyle, videoStyle, dualSpeakerMode, speaker1FontColor, speaker2FontColor }) => (
  <div className='previewContent'>
    <h3>Preview:</h3>
    <div className="preview-box" style={videoStyle}>
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
  </div>
);

export default Preview;
