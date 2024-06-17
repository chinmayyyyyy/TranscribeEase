import React from 'react';
import './home.css';

const FileUpload = ({ onFileChange }) => (
  <div>
    <h1>Upload a file</h1>
    <input type="file" onChange={onFileChange} />
  </div>
);

export default FileUpload;
