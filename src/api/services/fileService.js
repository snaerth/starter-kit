import fs from 'fs';

const directorys = ['assets', 'assets/images', 'assets/images/users'];

/**
 * Creates default directorys for project if they dont exist
 *
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function createDefaultDirectorys() {
    for (let i = 0, len = directorys.length; i < len; i++) {
        const dir = directorys[i];
        fs.exists(dir, exists => {
            if (!exists) {
                fs.mkdir(dir, error => {
                    if (error) {
                        throw new Error(`Failed to create directory ${dir}`);
                    }
                });
            }
        });
    }
}

/**
 * Deletes file from file system
 * 
 * @param {String} path - Path to file to delete
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
export function deleteFile(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, error => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });

}