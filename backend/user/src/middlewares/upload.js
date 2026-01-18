// ============================================
// FILE: backend/user/src/middlewares/upload.js
// PRODUCTION-READY - Multer with your config
// ============================================
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/env');

// Ensure upload directories exist
const uploadDirs = [
  'uploads/profiles',
  'uploads/documents',
  'uploads/attachments',
  'uploads/temp'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '../../', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage configuration for temporary local storage
// Files will be uploaded to Cloudinary and then deleted locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store temporarily in uploads/temp
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx|txt/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  
  // Check if file type is in allowed types from config
  if (config.upload.allowedFileTypes && !config.upload.allowedFileTypes.includes(mimetype)) {
    return cb(new Error(`File type ${mimetype} is not allowed`));
  }
  
  if (file.fieldname === 'profilePicture') {
    const isValidImage = allowedImageTypes.test(extname.replace('.', '')) && 
                         mimetype.startsWith('image/');
    
    if (isValidImage) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed for profile pictures!'));
    }
  } else if (file.fieldname === 'document') {
    const isValidDoc = allowedDocTypes.test(extname.replace('.', ''));
    
    if (isValidDoc) {
      cb(null, true);
    } else {
      cb(new Error('Only document files (PDF, DOC, DOCX, TXT) are allowed!'));
    }
  } else {
    // Allow all file types for general attachments
    cb(null, true);
  }
};

// Multer upload instance with config from env
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize || 5 * 1024 * 1024, // Default 5MB
  }
});

module.exports = upload;