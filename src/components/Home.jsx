import React, { Component } from 'react';
import './home.css';

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
            dualSpeakerMode: false, // Track if dual speaker mode is enabled
            speaker1FontColor: '#FF0000', // Font color for speaker 1
            speaker2FontColor: '#0000FF' // Font color for speaker 2
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
        const { file, fontFamily, fontSize, outline, outlineColor, shadow, speaker1FontColor, speaker2FontColor } = this.state;

        const formData = new FormData();
        formData.append('video', file);
        formData.append('fontFamily', fontFamily);
        formData.append('fontSize', fontSize);
        formData.append('outline', outline);
        formData.append('outlineColor', outlineColor);
        formData.append('shadow', shadow);
        formData.append('speaker1FontColor', speaker1FontColor);
        formData.append('speaker2FontColor', speaker2FontColor);

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
        const { srtText, file, fontFamily, fontSize, fontColor, outline, outlineColor, shadow } = this.state;

        const formData = new FormData();
        formData.append('video', file);
        formData.append('srtText', srtText);
        formData.append('fontFamily', fontFamily);
        formData.append('fontSize', fontSize);
        formData.append('fontColor', fontColor);
        formData.append('outline', outline);
        formData.append('outlineColor', outlineColor);
        formData.append('shadow', shadow);


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
        const { fontFamily, fontSize, fontColor, outline, outlineColor, shadow, backgroundColor, orientation, dualSpeakerMode, speaker1FontColor, speaker2FontColor, videoUrl } = this.state;

        const previewText = dualSpeakerMode
            ? `<span style="color:${speaker1FontColor}">Speaker 1: This is a preview of your subtitle text</span><br/>
               <span style="color:${speaker2FontColor}">Speaker 2: This is a preview of your subtitle text</span>`
            : `<span style="color:${fontColor}">This is a preview of your subtitle text</span>`;

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
            'Arial Black', 'Impact', 'Tahoma', 'Lucida Sans Unicode',
        ];

        return (
            <div className='container'>
                <div className='configure'>
                    <h1>Upload a file</h1>
                    <input type="file" onChange={this.handleFileChange} />
                    <div>
                        <label>Font Family:</label>
                        <select name="fontFamily" value={fontFamily} onChange={this.handleInputChange}>
                            {fontFamilies.map((font) => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Font Size:</label>
                        <input type="number" name="fontSize" value={fontSize} onChange={this.handleInputChange} />
                    </div>
                    {!dualSpeakerMode && (
                        <div>
                            <label>Font Color:</label>
                            <input type="color" name="fontColor" value={fontColor} onChange={this.handleInputChange} />
                        </div>
                    )}
                    <div>
                        <label>Outline:</label>
                        <input type="number" name="outline" value={outline} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Outline Color:</label>
                        <input type="color" name="outlineColor" value={outlineColor} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Shadow:</label>
                        <input type="number" name="shadow" value={shadow} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Background Color:</label>
                        <input type="color" name="backgroundColor" value={backgroundColor} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Orientation:</label>
                        <select name="orientation" value={orientation} onChange={this.handleInputChange}>
                            <option value="horizontal">Horizontal</option>
                            <option value="vertical">Vertical</option>
                        </select>
                    </div>
                    <div>
                        <label>Dual Speaker Mode:</label>
                        <input type="checkbox" name="dualSpeakerMode" checked={dualSpeakerMode} onChange={this.handleInputChange} />
                    </div>
                    {dualSpeakerMode && (
                        <>
                            <div>
                                <label>Speaker 1 Font Color:</label>
                                <input type="color" name="speaker1FontColor" value={speaker1FontColor} onChange={this.handleInputChange} />
                            </div>
                            <div>
                                <label>Speaker 2 Font Color:</label>
                                <input type="color" name="speaker2FontColor" value={speaker2FontColor} onChange={this.handleInputChange} />
                            </div>
                        </>
                    )}
                    <button onClick={this.handleFileUpload}>Upload</button>
                </div>
                <div className='previewContent'>
                    <h3>Preview:</h3>
                    <div className="preview-box" style={videoStyle}>
                        <div className="preview-text" dangerouslySetInnerHTML={{ __html: previewText }} />
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
    }
}
