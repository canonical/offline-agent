'use strict'

const http = require('http');
const snapd = require('./snapd');

const downloadPath = '/mnt/';

var server = http.createServer((req, res) => {
    // parse the URL
    let args = req.url.split('/');
    if (args.length != 3) {
        res.end('Incorrect URL format: /snap-name/revision\n\n');
        return;
    }

    // sideload the snap
    const snapName = args[1];
    const revision = args[2];
    let client = new snapd(downloadPath);
    client.sideloadInstall(snapName, revision)
        .then(resp => {
            res.end(JSON.stringify(resp));
        })
        .catch(e => {
            res.end(JSON.stringify(e));
        });

});

server.listen(5000, '127.0.0.1');

console.log('Agent installer service at http://localhost:5000 is running...')
