const express = require('express');
const fs = require('fs');
const request = require('request');
const http = require('http');

const app = express();
const port = 4000;

const fileUrl = 'http://localhost:3000/readFile/uploaded_file.txt'; 
const outputFile = 'output.txt'; 

// app.get('/', async (req, res) => {
//   try {
//     // Create a writable stream to the output file
//     const writer = fs.createWriteStream(outputFile);

//     // Make a GET request using request package
//     const response = request.get(fileUrl);

//     response.on("data",(chunk)=>{
//       console.log(chunk.length , "chunk");
//     })

//     // Pipe the response stream to the writer
//     response.pipe(writer);

//     // Handle events
//     writer.on('finish', () => {
//       console.log('File content written to', outputFile);
//       res.send('File content written to ' + outputFile);
//     });

//     writer.on('error', (err) => {
//       console.error('Error writing to file:', err);
//       res.status(500).send('Error writing to file');
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Error');
//   }
// });


app.get('/', async (req, res) => {
  try {
    // Create a writable stream to the output file
    const writer = fs.createWriteStream(outputFile);

    http.get(fileUrl,(response)=>{

     response.on('data',(chunk)=>{
      writer.write(chunk);
     })

     response.on('close',()=>{
      writer.close(()=>{
        console.log("Connection closed by server");
      })
     })

     response.on("end",()=>{
      writer.close(()=>{
        console.log("File written successsfully");
      })
      res.status(200).json({message:"File Read done Successfully"});
     })

     response.on('error',(error)=>{
      writer.close(()=>{
        console.log("Error occured");
      })
      res.status(500).json({error:error});
     })

    })
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
