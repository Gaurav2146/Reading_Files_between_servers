const http = require('http');
const fs = require('fs');

const port = 3000;
const filePath = 'input.txt'; // Path to your input file

const server = http.createServer((req, res) => {
  // Set appropriate headers
  res.setHeader('Content-Type', 'text/plain');

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

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
