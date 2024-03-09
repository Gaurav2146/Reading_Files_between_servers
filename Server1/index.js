const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/readFile/:filePath', (req, res) => {
  // Set appropriate headers
  res.setHeader('Content-Type', 'text/plain');

  let {filePath} = req.params;

  // Create a readable stream to read data from the file
  const readStream = fs.createReadStream(filePath, { highWaterMark: 16 * 1024 }); // Adjust the buffer size as needed

  // Pipe the file stream to the response stream
  readStream.pipe(res);

  // Handle errors
  readStream.on('error', (err) => {
    console.error('Error reading file:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });

  // Handle the client closing the connection
  res.on('close', () => {
    readStream.destroy();
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
