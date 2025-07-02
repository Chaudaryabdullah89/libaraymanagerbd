const express = require('express');
const multer = require('multer');
const uploadPdfToDropbox = require('../utils/uploadToDropbox');
const router = express.Router();
const upload = multer();

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    console.log('Received file:', req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const link = await uploadPdfToDropbox(fileBuffer, fileName);
    res.json({ link });
  } catch (err) {
    console.error('Dropbox upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 