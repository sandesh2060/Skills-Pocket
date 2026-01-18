
// ============================================
// FILE: backend/user/src/config/cloudinary.js
// PRODUCTION-READY - Updated to use your env.js structure
// ============================================
const cloudinary = require('cloudinary').v2;
const config = require('./env');
const logger = require('../utils/logger');
const fs = require('fs').promises;

// Configure cloudinary
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  
  logger.info('✅ Cloudinary configured successfully');
} else {
  logger.warn('⚠️ Cloudinary credentials not found. File uploads will be disabled.');
}

/**
 * Upload file to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Object>} Upload result
 */
const uploadToCloudinary = async (file, folder = 'skillspocket') => {
  try {
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey) {
      throw new Error('Cloudinary is not configured');
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      transformation: file.fieldname === 'profilePicture' ? [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ] : undefined
    });
    
    // Delete local file after successful upload
    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      logger.warn(`Failed to delete local file: ${unlinkError.message}`);
    }
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    // Delete local file if upload fails
    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      logger.warn(`Failed to delete local file after error: ${unlinkError.message}`);
    }
    
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw new Error('File upload failed');
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Public ID of file to delete
 * @param {String} resourceType - Type of resource (image, video, raw)
 * @returns {Promise<Object>} Delete result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    
    return result;
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
    throw new Error('File deletion failed');
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array<String>} publicIds - Array of public IDs
 * @param {String} resourceType - Type of resource
 * @returns {Promise<Object>} Delete result
 */
const deleteMultipleFiles = async (publicIds, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });
    
    return result;
  } catch (error) {
    logger.error(`Cloudinary bulk delete error: ${error.message}`);
    throw new Error('Bulk file deletion failed');
  }
};

/**
 * Generate optimized image URL
 * @param {String} publicId - Public ID of image
 * @param {Object} transformations - Transformation options
 * @returns {String} Optimized image URL
 */
const getOptimizedImageUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations,
  };

  return cloudinary.url(publicId, defaultTransformations);
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFiles,
  getOptimizedImageUrl,
};