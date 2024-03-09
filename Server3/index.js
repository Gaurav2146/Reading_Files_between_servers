// server.js

const express = require('express');
const app = express();
const port = 5000;

const fs = require('fs');

app.post('/upload', (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    return res.status(400).send('Bad Request: Content-Type must be multipart/form-data');
  }

  let writeStream = fs.createWriteStream('uploaded_file.txt');

  req.on('data', (chunk) => {
    writeStream.write(chunk);
  });

  req.on('end', () => {
    writeStream.end();
    res.send('File uploaded successfully');
  });

  req.on('error', (err) => {
    console.error('Error uploading file:', err);
    res.status(500).send('Internal Server Error');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
