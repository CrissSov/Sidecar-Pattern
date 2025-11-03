// auth-sidecar/sidecar.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const LOG_PATH = '/logs/sidecar.log';

http.createServer((req, res) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  fs.appendFileSync(LOG_PATH, log, 'utf8');

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', time: new Date().toISOString() }));
  } else {
    res.writeHead(200);
    res.end('Request intercepted and logged by Sidecar\n');
  }
}).listen(3001, () => console.log('🛰️  Sidecar running on port 3001'));
