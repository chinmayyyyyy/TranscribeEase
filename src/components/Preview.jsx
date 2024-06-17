import React from 'react';
import './home.css';
import { Player } from 'video-react';

const Preview = ({ previewVideoUrl, previewStyle, videoStyle, dualSpeakerMode, speaker1FontColor, speaker2FontColor }) => (
  <div className='previewContent'>
    <h3>Preview:</h3>
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
  </div>
);

export default Preview;
