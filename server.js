const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url;
  file = path.join(__dirname, file);
  const ext = path.extname(file);
  const type = mime[ext] || 'application/octet-stream';

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`\n  Site rodando em:  http://localhost:${port}\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const alt = port + 1;
    console.log(`  Porta ${port} em uso. Tentando ${alt}...\n`);
    server.listen(alt, () => {
      console.log(`  Site rodando em:  http://localhost:${alt}\n`);
    });
  } else throw err;
});
