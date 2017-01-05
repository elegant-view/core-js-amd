const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
const u = require('underscore');

new Promise((resolve, reject) => {
    let child = spawn('r.js', ['-convert', 'origin', 'dist']);
    child.on('exit', error => {
        error ? reject(error) : resolve();
    });
}).then(() => {
    let rootDir = path.resolve(__dirname, '../dist');
    return check(rootDir, true);

    function check(dir, isRoot = false) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                err ? reject(err) : resolve(files);
            });
        }).then(files => {
            return Promise.all(u.map(files, file => {
                return new Promise((resolve, reject) => {
                    let fullDir = path.resolve(dir, './' + file);
                    fs.stat(fullDir, (err, stats) => {
                        if (err) {
                            return reject(err);
                        }

                        if (stats.isDirectory()) {
                            return check(fullDir).then(resolve, reject);
                        }

                        if (!isRoot && stats.isFile() && file === 'index.js') {
                            return createMainModule(dir).then(resolve, reject);
                        }

                        resolve();
                    });
                });
            }));
        });
    }
}).catch(e => console.error(e.stack));

function createMainModule(directory) {
    let dirname = directory.split(path.sep).slice(-1)[0];
    return new Promise((resolve, reject) => {
        fs.writeFile(
            path.resolve(directory, `../${dirname}.js`),
            'define(function (require, exports, module) { module.exports = require(\'./' + dirname + '/index\'); });',
            err => {
                err ? reject(err) : resolve();
            }
        );
    });
}
