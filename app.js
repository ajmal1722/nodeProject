const fs = require('fs');
const http = require('http');
const { type } = require('os');

const home = fs.readFileSync('./index.html');
const form = fs.readFileSync('./form.html');

const server = http.createServer(function(req, res) {
    let path = req.url;

    if (path === '/' || path.toLowerCase() === 'home'){
        res.end(home);
    } else if (path.toLowerCase() === '/form') {
        res.end(form);
    }else {
        res.end('error 404 : Page not found');
    }
})

server.listen(8000,'127.0.0.1', () => {
    console.log('server has created')
})
