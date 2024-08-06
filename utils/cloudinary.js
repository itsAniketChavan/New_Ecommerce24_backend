// upload.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        // console.log('Upload successful:', result);
        return result;
    } catch (error) {
        // console.error('Error uploading image:', error);
        return false;
    }
};
exports.destroyImage = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      return result;
    } catch (error) {
      console.error('Error destroying image:', error);
      throw error;
    }
  };


    