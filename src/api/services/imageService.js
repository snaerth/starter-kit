import multer from 'multer';

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
    limits: {
      files: 1,
      fileSize: megabytes * 1024 * 1024
    }
  });
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

    return resolve(null);
  });
}