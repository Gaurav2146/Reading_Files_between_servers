const express = require('express');
const fs = require('fs');
const request = require('request');

const app = express();
const port = 4000;

const fileUrl = 'http://localhost:3000/input.txt'; 
const outputFile = 'output.txt'; 

app.get('/', async (req, res) => {
  try {
    // Create a writable stream to the output file
    const writer = fs.createWriteStream(outputFile);

    // Make a GET request using request package
    const response = request.get(fileUrl);

    response.on("data",(chunk)=>{
      console.log(chunk.length , "chunk");
    })

    // Pipe the response stream to the writer
    response.pipe(writer);

    // Handle events
    writer.on('finish', () => {
      console.log('File content written to', outputFile);
      res.send('File content written to ' + outputFile);
    });

    writer.on('error', (err) => {
      console.error('Error writing to file:', err);
      res.status(500).send('Error writing to file');
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
