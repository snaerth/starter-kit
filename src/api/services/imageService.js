import fs from 'fs';

/**
 * Saves image to file system
 *
 * @param {Object} data - Image binary data
 * @param {String} imagePath - Path to image in file system
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
export function saveImage(data, imagePath) {
  return new Promise((reject, resolve) => {
    fs.writeFile(data, imagePath, 'binary', (error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  });
}

// export function saveImages(path, images) {
//     async.map(images, (data, callback) => {
//         fs.writeFile(data, , 'binary', error => {
//             if(error) {
//                 throw err;
//             }

//             console.log('Image Saved');
//         });
//     });
// }


/**
 * Checks if file is image
 *
 * @param {Object} file - Image binary data
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
export function isImage(file) {
  return new Promise((reject, resolve) => {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return reject('Only image files are allowed!');
    }

    resolve(null);
  });
};