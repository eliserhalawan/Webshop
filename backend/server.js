const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

//Middleware
app.use(cors());
app.use(express.json());


// Set up multer for file uploads
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {   
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the current timestamp and original name
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }  
}); 

// Configure multer with storage, file size limit, and file type filter
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        // Accept only image files
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
