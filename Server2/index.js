const http = require('http');
const fs = require('fs');

// Define the URL of the file on the other web server
const fileUrl = 'http://localhost:3000/input.txt'; // Replace 'example.com' with the actual domain
const outputFile = 'output.txt'; // Name of the file to write the content to

// Make a GET request to the server
http.get(fileUrl, (response) => {
  let data = '';

  // As data comes in, concatenate it to 'data'
  response.on('data', (chunk) => {
    console.log("On Data called");
    console.log(chunk.length, "chunk length");
    data += chunk;
  });

  // When all data is received
  response.on('end', () => {
    // Write the data to the output file
    fs.writeFile(outputFile, data, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('File content written to', outputFile);
      }
    });
  });
}).on('error', (error) => {
  console.error('Error fetching file:', error.message);
});
