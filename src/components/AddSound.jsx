import React, { Component } from 'react';
import { Player, ControlBar } from 'video-react';
import './AddSound.css'; 

export default class AddSound extends Component {
    constructor(props) {
        super(props);
        this.state = {
            video: null,
            audio: null,
            videoUrl: '',
            type: 'merge',
            delay: '',
            volume: '',
            shortest: false,
            previewVideo: '',
            previewAudio: ''
        };
    }

    handleAudioChange = (event) => {
        const file = event.target.files[0];
        const previewAudio = URL.createObjectURL(file);
        this.setState({ audio: file, previewAudio });
    }

    handleFileChange = (event) => {
        const file = event.target.files[0];
        const previewVideo = URL.createObjectURL(file);
        this.setState({ video: file, previewVideo });
    }

    handleTypeChange = (event) => {
        this.setState({ type: event.target.value });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleCheckboxChange = (event) => {
        this.setState({ shortest: event.target.checked });
    }

    handleAddSound = () => {
        const { video, audio, type, delay, volume, shortest } = this.state;
        const formData = new FormData();
        formData.append('video', video);
        if (audio) formData.append('audio', audio);
        formData.append('type', type);
        if (delay) formData.append('delay', delay);
        if (volume) formData.append('volume', volume);
        formData.append('shortest', shortest);

        fetch('https://transcribeease.onrender.com/processMedia', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ videoUrl: data.videoUrl });
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        const { previewVideo, previewAudio, videoUrl, type, delay, volume, shortest } = this.state;

        return (
            <div className="container">
                <div className="configure">
                    <div className="upload-form">
                        <h3>Upload Video and Sound</h3>

                        <label>Video</label>
                        <input type="file" accept="video/*" onChange={this.handleFileChange} />

                        <label>Audio</label>
                        <input type="file" accept="audio/*" onChange={this.handleAudioChange} />

                        <label>Type</label>
                        <select value={type} onChange={this.handleTypeChange}>
                            <option value="merge">Merge</option>
                            <option value="replace">Replace</option>
                            <option value="shorten">Shorten</option>
                            <option value="combine">Combine</option>
                            <option value="mixVolume">Mix Volume</option>
                            <option value="mixDelay">Mix Delay</option>
                            <option value="amerge">Amerge</option>
                            <option value="silent">Add Silent Audio</option>
                            <option value="delayAudio">Add Audio with Delay</option>
                            <option value="multipleTracks">Add Multiple Audio Tracks</option>
                            <option value="loopAudio">Loop Audio</option>
                        </select>

                        {['mixDelay', 'delayAudio'].includes(type) && (
                            <div>
                                <label>Delay (ms)</label>
                                <input
                                    type="number"
                                    name="delay"
                                    value={delay}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        )}

                        {type === 'mixVolume' && (
                            <div>
                                <label>Volume</label>
                                <input
                                    type="number"
                                    name="volume"
                                    value={volume}
                                    onChange={this.handleInputChange}
                                    step="0.1"
                                    min="0"
                                    max="1"
                                />
                            </div>
                        )}

                        {['shorten', 'combine', 'mixVolume', 'mixDelay', 'amerge', 'delayAudio', 'loopAudio'].includes(type) && (
                            <div>
                                <label>Shortest</label>
                                <input
                                    width={400}
                                    type="checkbox"
                                    name="shortest"
                                    checked={shortest}
                                    onChange={this.handleCheckboxChange}
                                />
                            </div>
                        )}

                        <button onClick={this.handleAddSound}>Add Sound</button>
                    </div>
                </div>


                    <div className="previewContent">
                        {previewVideo && (
                            <div className="preview-video">
                                <Player
                                    src={previewVideo}
                                    fluid={false}
                                    width={520}
                                    height={280}
                                >
                                    <ControlBar autoHide={false} />
                                </Player>
                            </div>
                        )}

                        {previewAudio && (
                            <div className="preview-audio">
                                <audio controls src={previewAudio} />
                            </div>
                        )}
                </div>

                {videoUrl && (
                    <div className="processed-video">
                        <video controls src={videoUrl} style={{ width: '100%' }}></video>
                    </div>
                )}

            </div>
        );
    }
}
