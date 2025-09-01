const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'arogyamrahita/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Function to handle image upload
const uploadImage = upload.single('image');

// Function to get image URL (now returns Cloudinary URL directly)
const getImageUrl = (cloudinaryUrl) => {
    return cloudinaryUrl; // Cloudinary URL is already complete
};

// Function to delete image from Cloudinary
const deleteImage = async (cloudinaryUrl) => {
    try {
        // Extract public_id from Cloudinary URL
        const publicId = cloudinaryUrl.split('/').pop().split('.')[0];
        const result = await cloudinary.uploader.destroy(`arogyamrahita/products/${publicId}`);
        return result.result === 'ok';
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return false;
    }
};

module.exports = {
    uploadImage,
    getImageUrl,
    deleteImage
};
