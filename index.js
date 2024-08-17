const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/crop', upload.single('image'), async (req, res) => {
    try {
        // Get coordinates and dimensions from the request
        const x = parseInt(req.body.x, 10);
        const y = parseInt(req.body.y, 10);
        const width = parseInt(req.body.width, 10);
        const height = parseInt(req.body.height, 10);

        // Validate input
        if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
            return res.status(400).json({ error: 'Invalid coordinates or dimensions' });
        }

        // Load the uploaded image
        const inputPath = req.file.path;
        const outputPath = path.join('uploads', 'cropped_image.jpg');

        // Perform image cropping
        await sharp(inputPath)
            .extract({ left: x, top: y, width, height })
            .toFile(outputPath);

        // Send the cropped image as a response
        res.sendFile(outputPath, { root: '.' }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            // Clean up uploaded files
            fs.unlink(inputPath, () => {}); // Delete the uploaded file
            fs.unlink(outputPath, () => {}); // Delete the cropped image
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




