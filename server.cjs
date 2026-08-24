// 极简静态服务器（零依赖），用于局域网内访问本工具
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = parseInt(process.env.PORT || process.argv[2] || '8080', 10);
const DIR = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(function (req, res) {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/') url = '/index.html';
  const filePath = path.join(DIR, url);
  if (!filePath.startsWith(DIR)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, function (err, data) {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 Not Found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', function () {
  console.log('==============================================');
  console.log(' 西安电子警察分布地图 已启动');
  console.log(' 数据来源：西安交警微信服务号——电子警察分布告知');
  console.log('==============================================');
  console.log(' 本机访问:   http://127.0.0.1:' + PORT);
  const ifs = os.networkInterfaces();
  for (const name in ifs) {
    for (const iface of ifs[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(' 局域网访问: http://' + iface.address + ':' + PORT);
      }
    }
  }
  console.log('');
  console.log(' 其他设备用浏览器打开上面的「局域网访问」地址即可。');
  console.log(' 按 Ctrl+C 停止服务。');
});
