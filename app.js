const fs = require('fs');
const http = require('http');
const { type } = require('os');

const home = fs.readFileSync('./index.html', 'utf-8');
const form = fs.readFileSync('./form.html', 'utf-8');
const jsonData = JSON.parse(fs.readFileSync('./Datas/data.json', 'utf-8'))

const server = http.createServer(function(req, res) {
    let path = req.url;

    if (path === '/' || path.toLowerCase() === 'home'){
        res.writeHead(200, {
            'Content-Type' : 'text/html'
            // 'Content-Type' : 'application/json'
        })
        res.end(home.replace('{{%CONTENT%}}', jsonData));
    } else if (path.toLowerCase() === '/form') {
        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        res.end(form);
    }else {
        res.writeHead(404, {
            'Content-Type' : 'text/html'
        })
        res.end('error 404 : Page not found');
    }
})

server.listen(8000,'127.0.0.1', () => {
    console.log('server has created')
})
