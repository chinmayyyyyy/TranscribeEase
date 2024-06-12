import React, { Component } from 'react';
import './home.css';
import FileUpload from './FileUpload';
import FontSettings from './FontSetting';
import DualSpeakerSettings from './DualSpeaker';
import Preview from './Preview';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      srtText: '',
      videoUrl: '',
      fontFamily: 'Arial',
      fontSize: '24',
      fontColor: '#FFFFFF',
      outline: '1',
      outlineColor: '#000000',
      shadow: '1',
      backgroundColor: '#000000',
      orientation: 'horizontal',
      dualSpeakerMode: false,
      speaker1FontColor: '#FF0000',
      speaker2FontColor: '#0000FF',
      alignment: '2' // Default alignment (Bottom Center)
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDualSpeakerUpload = this.handleDualSpeakerUpload.bind(this);
  }

  handleFileChange(event) {
    this.setState({ file: event.target.files[0] });
  }

  handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    type === 'checkbox' ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
  }

  handleFileUpload() {
    if (!this.state.file) {
      alert('Please select a file first!');
      return;
    }

    if (this.state.dualSpeakerMode) {
      this.handleDualSpeakerUpload();
    } else {
      const formData = new FormData();
      formData.append('video', this.state.file);

      fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.text())
        .then((data) => {
          this.setState({ srtText: data }, () => {
            this.processVideoWithSubtitles();
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }

  handleDualSpeakerUpload() {
    console.log("Dual Speaker Mode");
    const { file, fontFamily, fontSize, outline, outlineColor, shadow, speaker1FontColor, speaker2FontColor, alignment } = this.state;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('fontFamily', fontFamily);
    formData.append('fontSize', fontSize);
    formData.append('outline', outline);
    formData.append('outlineColor', outlineColor);
    formData.append('shadow', shadow);
    formData.append('speaker1FontColor', speaker1FontColor);
    formData.append('speaker2FontColor', speaker2FontColor);
    formData.append('alignment', alignment);

    fetch('http://localhost:5000/process-video-dual-speaker', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ videoUrl: data.videoUrl });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  processVideoWithSubtitles() {
    const { srtText, file, fontFamily, fontSize, fontColor, outline, outlineColor, shadow, alignment } = this.state;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('srtText', srtText);
    formData.append('fontFamily', fontFamily);
    formData.append('fontSize', fontSize);
    formData.append('fontColor', fontColor);
    formData.append('outline', outline);
    formData.append('outlineColor', outlineColor);
    formData.append('shadow', shadow);
    formData.append('alignment', alignment);

    fetch('http://localhost:5000/process-video', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ videoUrl: data.videoUrl });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  render() {
    const { fontFamily, fontSize, fontColor, outline, outlineColor, shadow, backgroundColor, orientation, dualSpeakerMode, speaker1FontColor, speaker2FontColor, videoUrl, alignment } = this.state;

    const previewStyle = {
      fontFamily,
      fontSize: `${fontSize}px`,
      color: fontColor,
      textShadow: shadow !== '0' ? `1px 1px ${shadow}px rgba(0, 0, 0, 0.5)` : 'none',
      WebkitTextStroke: outline !== '0' ? `${outline}px ${outlineColor}` : 'none',
      position: 'absolute',
      bottom: '10%',
      width: '100%',
      textAlign: 'center',
    };

    const videoStyle = {
      backgroundColor,
      position: 'relative',
      width: orientation === 'horizontal' ? '640px' : '360px',
      height: orientation === 'horizontal' ? '360px' : '640px',
      margin: '20px auto',
    };

    const fontFamilies = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
      'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 'Trebuchet MS',
      'Arial Black', 'Impact', 'Tahoma', 'Lucida Sans Unicode', 'Candara', 'Californian FB',
      'Gill Sans', 'Arial Narrow', 'Lucida Grande', 'Geneva', 'Franklin Gothic Medium', 'Century Gothic',
      'Merriweather', 'Pluto Sans', 'Lato',
    ];

    return (
      <div className='container'>
        <div className ='configure'>

        <FileUpload onFileChange={this.handleFileChange} />
        <FontSettings
          settings={this.state}
          onInputChange={this.handleInputChange}
          fontFamilies={fontFamilies}
          dualSpeakerMode={dualSpeakerMode}
        />
        <div>
          <label>Dual Speaker Mode:</label>
          <input type="checkbox" name="dualSpeakerMode" checked={dualSpeakerMode} onChange={this.handleInputChange} />
        </div>
        {dualSpeakerMode && (
          <DualSpeakerSettings
            settings={this.state}
            onInputChange={this.handleInputChange}
          />
        )}
        <button onClick={this.handleFileUpload}>Upload</button>
        </div>
        <div className='previewContent'>
        <Preview
          previewStyle={previewStyle}
          videoStyle={videoStyle}
          dualSpeakerMode={dualSpeakerMode}
          speaker1FontColor={speaker1FontColor}
          speaker2FontColor={speaker2FontColor}
        />
        </div>
        {videoUrl && (
          <div>
            <h2>Processed Video:</h2>
            <video controls src={videoUrl} style={{ width: '100%' }} />
          </div>
        )}
      </div>
    );
  }
}
