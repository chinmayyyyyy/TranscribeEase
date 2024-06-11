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
        };
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleFileChange(event) {
        this.setState({ file: event.target.files[0] });
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFileUpload() {
        if (!this.state.file) {
            alert('Please select a file first!');
            return;
        }

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
        const { fontFamily, fontSize, fontColor, outline, outlineColor, shadow, backgroundColor, orientation } = this.state;
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
                    <div>
                        <label>Font Color:</label>
                        <input type="color" name="fontColor" value={fontColor} onChange={this.handleInputChange} />
                    </div>
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
                    <button onClick={this.handleFileUpload}>Upload</button>
                </div>
                <div className='previewContent'>
                    <h3>Preview:</h3>
                    <div className="preview-box" style={videoStyle}>
                        <div className="preview-text" style={previewStyle}>This is a preview of your subtitle text</div>
                    </div>
                </div>
                {this.state.videoUrl && (
                    <div>
                        <h2>Processed Video:</h2>
                        <video controls src={this.state.videoUrl} />
                    </div>
                )}
            </div>
        );
    }
}
