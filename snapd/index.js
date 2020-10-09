'use strict'

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const socketFile = '/run/snapd.socket';

class Snapd {
    constructor(downloadPath) {
        this.downloadPath = downloadPath;
    }

    ack(assertion) {
        const url = '/v2/assertions';
        const options = {
            socketPath: socketFile,
            method: 'POST',
            headers: { 'Content-Type': 'application/x.ubuntu.assertion' },
            data: assertion,
            url,
        };
        return axios(options);
    }

    install(snapName, filePath) {
        const url = '/v2/snaps';
        const formData = new FormData();
        formData.append('action', 'install');
        formData.append('name', snapName);
        formData.append('snap-path', filePath);
        formData.append('snap', fs.createReadStream(filePath));

        const options = {
            socketPath: socketFile,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary() },
        };
        return axios.post(url, formData, options);
    }

    async sideloadInstall(snapName, revision) {
        const assertsPath = this.downloadPath + snapName + '_' + revision + '.assert';
        const snapPath = this.downloadPath + snapName + '_' + revision + '.snap';

        // acknowledge the snap assertion
        try {
            const data = fs.readFileSync(assertsPath, { encoding: 'utf8' });
            await this.ack(data);
        } catch (e) {
            if (e.response && e.response.data) {
                return e.response.data;
            }
            return {
                type: 'error',
                status: 'Error',
                result: { message: e.toString(), kind: e.errno }
            };
        }

        // install the snap
        try {
            const resp = await this.install(snapName, snapPath);
            return resp.data;
        } catch (e) {
            if (e.response && e.response.data) {
                return e.response.data;
            }
            return {
                type: 'error',
                status: 'Error',
                result: { message: e.toString(), kind: e.errno }
            };
        }
    }

}

module.exports = Snapd;
