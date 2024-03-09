const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000; // Change this to the desired port number
const filePath = 'input.txt'; // Path to your input file

const server = http.createServer((req, res) => {
  // Check if the request method is GET
  if (req.method === 'GET') {
    // Check if the request is for the file
    if (req.url === '/input.txt') {
      // Read the file
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
