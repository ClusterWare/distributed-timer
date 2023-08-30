let counter = 0;
const moment = require('moment');
const http = require('http');
const https = require('https');
const fs = require('fs');

const port = process.env.PORT || 8888;
const cert = process.env.CERT_PATH;
const key = process.env.CERT_KEY_PATH;

const secure = (cert && key);

const interval = setInterval(function () {
  counter++;
  console.log(moment.duration(counter, "seconds").humanize() + ` (${counter})`);
}, 1000);

const handler = function (req, res) {
  const result = {
    counter,
    duration: moment.duration(counter, "seconds").humanize(),
    port,
  }

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end();
};

if (secure) {
  console.log(`Creating secure server on ${port}`);
  https.createServer({
    cert : fs.readFileSync(cert, 'utf8'),
    key: fs.readFileSync(key, 'utf8'),
  }, handler).listen(port);
} else {
  console.log(`Creating non-secure server on ${port}`);
  http.createServer(handler).listen(port);
}
