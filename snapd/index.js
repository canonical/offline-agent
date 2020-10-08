'use strict'

const axios = require('axios');
const socketFile = '/run/snapd.socket';

class Snapd {

    async ack(assertion) {
        const url = '/v2/assertions';
        const options = {
            socketPath: socketFile,
            method: 'POST',
            headers: { 'Content-Type': 'application/x.ubuntu.assertion' },
            data: assertion,
            url,
        };
        axios(options);
    }


}

module.exports = Snapd;
