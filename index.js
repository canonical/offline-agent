'use strict'

const snapd = require('./snapd');
const fs = require('fs');

const downloadPath = '/mnt/';

let args = process.argv.slice(2);
if (args.length < 2) {
    console.log('The snap name and revision must be provided');
    return;
}

const snapName = args[0];
const revision = args[1];

const assertsPath = downloadPath + snapName + '_' + revision + '.assert';
const snapPath = downloadPath + snapName + '_' + revision + '.snap';

console.log(assertsPath);
console.log(snapPath);

// acknowledge the snap assertion
fs.readFile(assertsPath, 'utf8', (err,data) => {
    if (err) {
        return console.log(err);
    }
    console.log(data);

    snapd.ack(data);
});


// base64-encode the snap file

// install the snap

