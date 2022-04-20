/* eslint-disable @typescript-eslint/no-var-requires */
const https = require('https');

exports.handler = async function (event) {
  const promise = new Promise(function (resolve, reject) {
    if (event.hostname && event.path) {
      const options = {
        hostname: event.hostname,
        path: event.path,
      };
      https
        .get(options, res => {
          resolve(res.statusCode);
        })
        .on('error', e => {
          reject(Error(e));
        });
    } else {
      reject(`Url not found`);
    }
  });
  return promise;
};
