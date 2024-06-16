import React from 'react';
import './home.css';

const FileUpload = ({ onFileChange }) => (
  
  <div>
    <h1 style={{textAlign : 'center'}}>Upload a file</h1>
    <input type="file" accept="video/*" onChange={onFileChange} />
  </div>
);

export default FileUpload;
