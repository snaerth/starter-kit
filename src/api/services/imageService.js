import multer from 'multer';
import fs from 'fs';

/**
 * Returns multer setup object for image uploading
 *
 * @param {String} folderDest - Path to folder where images are stored
 * @param {Int} megabytes - Megabytes
 * @returns {Object} multer
 * @author Snær Seljan Þóroddsson
 */
export function imageStorageHelper(folderDest, megabytes) {
  megabytes = megabytes || 2;

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderDest);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
    limits: uploadLimits(1, megabytes)
  });
}

/**
 * Returns limits object for multer setup object
 *
 * @param {Int} fileCount - Number of files to upload
 * @param {Int} megabytes - Megabytes
 * @returns {Object} limits
 * @author Snær Seljan Þóroddsson
 */
export function uploadLimits(fileCount, megabytes) {
  return {
    files: fileCount,
    fileSize: megabytes * 1024 * 1024
  };
}

/**
 * Checks if file is image
 *
 * @param {Object} file - Image binary data
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
export function isImage(file) {
  return new Promise((resolve, reject) => {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return reject('Only image files are allowed!');
    }

    return resolve();
  });
}

/**
 * Saves image to files system
 *
 * @param {String} data - String of data
 * @param {String} path - Path to save file
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
export function saveImageToDisk(data, path) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'binary', error => {
      if(error) {
        return reject('Cound not save image');
      }

      return resolve();
    });
  });
}