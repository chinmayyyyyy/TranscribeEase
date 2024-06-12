require('dotenv').config()
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const { env } = require('process');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.post('/transcribe', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        console.log("Process Started")
        const fetch = (await import('node-fetch')).default;
        const fileStream = fs.createReadStream(req.file.path);
        const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
            method: 'POST',
            headers: {
                'Authorization': process.env.API_KEY ,
                'Content-Type': 'application/octet-stream'
            },
            body: fileStream,
        });
        const uploadResult = await uploadResponse.json();
        
        const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
                'Authorization': process.env.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ audio_url: uploadResult.upload_url, speaker_labels: true }),
        });
        const transcriptionResult = await transcriptionResponse.json();
        const { id } = transcriptionResult;

        const checkStatus = async () => {
            const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': process.env.API_KEY
                }
            });
            const statusResult = await statusResponse.json();
            if (statusResult.status === 'completed') {
                console.log("SRT Genrated");
                clearInterval(statusInterval);
                const srtResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}/srt`, {
                    method: 'GET',
                    headers: {
                        'Authorization': process.env.API_KEY
                    }
                });
                const srtText = await srtResponse.text();
                res.setHeader('Content-Type', 'text/plain');
                res.send(srtText);
            } else if (statusResult.status === 'failed') {
                clearInterval(statusInterval);
                res.status(500).send('Transcription failed.');
            }
        };

        const statusInterval = setInterval(checkStatus, 5000);

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting the temporary file', err);
            }
        });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

function hexToFFmpegColor(hex) {
    const alpha = '00';
    const color = hex.slice(1);
    const bgr = color.match(/.{2}/g).reverse().join('');
    return `&H${alpha}${bgr}`;
}

app.post('/process-video', upload.single('video'), async (req, res) => {
    console.log("Adding SRT to video started ");
    const ffmpegPath = 'ffmpeg';
    try {
        const videoPath = req.file.path;
        const srtText = req.body.srtText; 
        const fontFamily = req.body.fontFamily;
        const fontSize = req.body.fontSize;
        const fontColor = hexToFFmpegColor(req.body.fontColor);
        const outline = req.body.outline;
        const outlineColor = hexToFFmpegColor(req.body.outlineColor);
        const shadow = req.body.shadow;

        const srtFilePath = `temp_${Date.now()}.srt`;
        fs.writeFileSync(srtFilePath, srtText, 'utf8');

        const outputDir = path.join(__dirname, 'videos');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const outputFilePath = path.join(outputDir, `output_${Date.now()}.mp4`);
        const ffmpegCommand = `${ffmpegPath} -i ${videoPath} -vf "subtitles=${srtFilePath}:force_style='Alpha=0,FadeIn,Alpha=1,FadeOut,FontName=${fontFamily},FontSize=${fontSize},PrimaryColour=${fontColor},Outline=${outline},OutlineColour=${outlineColor},Shadow=${shadow}'" ${outputFilePath}`;

        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Error processing video:', error);
                res.status(500).send('Error processing video.');
                return;
            }

            const videoUrl = `http://localhost:5000/videos/${path.basename(outputFilePath)}`;
            res.json({ videoUrl });

            fs.unlink(videoPath, () => {});
            fs.unlink(srtFilePath, () => {});
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing request.');
    }
});

// Dual speaker mode 
function convertUtterancesToSRT(utterances, speakerColors) {
    let srt = '';
    let index = 1;

    utterances.forEach(utterance => {
        const startTime = new Date(utterance.start).toISOString().substr(11, 12).replace('.', ',');
        const endTime = new Date(utterance.end).toISOString().substr(11, 12).replace('.', ',');
        const speakerColor = speakerColors[utterance.speaker];

        srt += `${index}\n`;
        srt += `${startTime} --> ${endTime}\n`;
        srt += `<font color="${speakerColor}">${utterance.text}</font>\n\n`;
        index++;
    });

    return srt;
}

app.post('/process-video-dual-speaker', upload.single('video'), async (req, res) => {
    console.log("Transcribing and processing video with dual speaker mode started");
    const ffmpegPath = 'ffmpeg';
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const fetch = (await import('node-fetch')).default;
        const fileStream = fs.createReadStream(req.file.path);
        const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
            method: 'POST',
            headers: {
                'Authorization': process.env.API_KEY,
                'Content-Type': 'application/octet-stream'
            },
            body: fileStream,
        });
        const uploadResult = await uploadResponse.json();

        const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
                'Authorization': process.env.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ audio_url: uploadResult.upload_url, speaker_labels: true , speakers_expected :2}),
        });
        const transcriptionResult = await transcriptionResponse.json();
        const { id } = transcriptionResult;

        const checkStatus = async () => {
            const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': process.env.API_KEY
                }
            });

            const statusResult = await statusResponse.json();
            if (statusResult.status === 'completed') {
                console.log("Transcription Completed");
                clearInterval(statusInterval);

                console.log("Generating SRT for 2 Speakers");
                const utterances = statusResult.utterances;
                const fontFamily = req.body.fontFamily;
                const fontSize = req.body.fontSize;
                const outline = req.body.outline;
                const outlineColor = hexToFFmpegColor(req.body.outlineColor);
                const shadow = req.body.shadow;
                let speakerColors = {
                    'A': req.body.speaker1FontColor,
                    'B': req.body.speaker2FontColor
                };

                const srtText = convertUtterancesToSRT(utterances, speakerColors);

                const srtFilePath = `temp_${Date.now()}.srt`;
                fs.writeFileSync(srtFilePath, srtText, 'utf8');

                const outputDir = path.join(__dirname, 'videos');
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir);
                }

                const outputFilePath = path.join(outputDir, `output_dual_speaker_${Date.now()}.mp4`);

                const ffmpegCommand = `${ffmpegPath} -i ${req.file.path} -vf "subtitles=${srtFilePath}:force_style='FontName=${fontFamily},FontSize=${fontSize},Outline=${outline},OutlineColour=${outlineColor},Shadow=${shadow}'" ${outputFilePath}`;

                exec(ffmpegCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error processing video:', error);
                        res.status(500).send('Error processing video.');
                        return;
                    }

                    const videoUrl = `http://localhost:5000/videos/${path.basename(outputFilePath)}`;
                    res.json({ videoUrl });

                    fs.unlink(req.file.path, () => {});
                    fs.unlink(srtFilePath, () => {});
                });
            } else if (statusResult.status === 'failed') {
                clearInterval(statusInterval);
                res.status(500).send('Transcription failed.');
            }
        };

        const statusInterval = setInterval(checkStatus, 5000);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing request.');
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});