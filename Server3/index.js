// server.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 5000;

const fs = require('fs');

app.use(cors({
  origin: '*', // Change this to your allowed origins, e.g., 'http://example.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Change this to your allowed methods
}));

// app.post('/upload/:FileId', async (req, res) => {

//   if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
//     return res.status(400).send('Bad Request: Content-Type must be multipart/form-data');
//   }

//   // const writeStream = fs.createWriteStream("uploaded_file.mp4", { flags: 'a' });

//   const writeStream = fs.createWriteStream("uploaded_file.mp4");

//   req.on('data', (chunk) => {
//     console.log(chunk.length, "chunk");
//     writeStream.write(chunk);
//   });

//   req.on('end', () => {
//     writeStream.end();
//     res.status(200).json({ message: 'File uploaded successfully' });
//   });

//   req.on('error', (err) => {
//     console.error('Error uploading file:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   });
// });

// Multer configuration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Destination folder where files will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  }
});

const upload = multer({ storage: storage });

// POST endpoint for uploading MP4 file
app.post('/upload/:FileId', upload.single('file'), (req, res) => {
  // Handle file upload here
  res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.get("/uploadCompleted/:FileId", (req, res, next) => {
  try {
    let { FileId } = req.params;
    console.log("FileId " + FileId + " is Uploaded Successfully");
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



