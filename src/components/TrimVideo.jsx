import React, { Component } from 'react';
import { Range } from 'react-range';
import { Player, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css'; // import css

export default class TrimVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      videoUrl: '',
      trimmedVideoUrl: '',
      duration: 10,
      startTime: 0,
      endTime: 10,
      currentTime: 0,
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleTrimVideo = this.handleTrimVideo.bind(this);
    this.handleVideoLoad = this.handleVideoLoad.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    const videoUrl = URL.createObjectURL(file);
    this.setState({ file, videoUrl, trimmedVideoUrl: '', startTime: 0, endTime: 10 });
  }

  handleVideoLoad(e) {
    const duration = e.target.duration;
    this.setState({ duration, endTime: duration });
  }

  handleSliderChange(values) {
    this.setState({ startTime: values[0], endTime: values[1] });
    this.handleSeek(values[0]);
  }

  handleTimeUpdate(e) {
    this.setState({ currentTime: e.target.currentTime });
  }

  handleSeek(time) {
    if (this.player) {
      this.player.seek(time);
    }
  }

  handleTrimVideo() {
    const { file, startTime, endTime } = this.state;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);

    fetch('http://localhost:5000/trim-video', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ trimmedVideoUrl: data.videoUrl });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  render() {
    const { videoUrl, trimmedVideoUrl, duration, startTime, endTime, currentTime } = this.state;

    return (
      <div className="trim-video-container">
        <h2>Trim Video</h2>
        <input type="file" accept="video/*" onChange={this.handleFileChange} />
        {videoUrl && (
          <div>
            <Player
              src={videoUrl}
              fluid={false}
              width={640}
              height={360}
              onLoadedMetadata={this.handleVideoLoad}
              onTimeUpdate={this.handleTimeUpdate}
              ref={(player) => { this.player = player; }}
            >
              <ControlBar autoHide={false} />
            </Player>
            <div style={{ margin: '20px 0' }}>
              <Range
                step={0.1}
                min={0}
                max={duration}
                values={[startTime, endTime]}
                onChange={this.handleSliderChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '6px',
                      width: '100%',
                      backgroundColor: '#ccc',
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ index, props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '16px',
                      width: '16px',
                      backgroundColor: index === 0 ? '#00f' : '#f00',
                    }}
                  />
                )}
              />
              <div>
                <span>Start Time: {startTime.toFixed(2)}</span>
                <span style={{ float: 'right' }}>End Time: {endTime.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={this.handleTrimVideo}>Trim Video</button>
          </div>
        )}

        {trimmedVideoUrl && (
          <div className='previewVideo'>
            <h3>Trimmed Video:</h3>
            <video controls src={trimmedVideoUrl} style={{ width: '100%' }} />
          </div>
        )}
      </div>
    );
  }
}
