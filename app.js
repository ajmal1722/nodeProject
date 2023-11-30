const fs = require('fs');
const http = require('http');
const { type } = require('os');

const html = fs.readFileSync('./index.html');

const server = http.createServer(function(req, res) {
    res.setHeader('Content-Type','text/html');
    res.write(html);
    res.end();
    // console.log('A new requst is received');
})

server.listen(8000,'127.0.0.1', () => {
    console.log('server has created')
})
