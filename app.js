const fs = require('fs');
const http = require('http');
const { type } = require('os');

const home = fs.readFileSync('./index.html', 'utf-8');
const form = fs.readFileSync('./form.html', 'utf-8');
const tableTemplate = fs.readFileSync('./table.html', 'utf-8')
const jsonData = JSON.parse(fs.readFileSync('./Datas/data.json', 'utf-8'))

const generateTableRows = () => {
    return  jsonData.map(entry => {
        return  `<tr>
                    <td>${entry.no}</td>
                    <td>${entry.name}</td>
                    <td>${entry.age}</td>
                    <td>${entry.email}</td>
                    <td>${entry.gender}</td>
                </tr>`
    }).join('')
            
}

const server = http.createServer(function(req, res) {
    let path = req.url;

    if (path === '/' || path.toLowerCase() === 'home'){
        res.writeHead(200, {
            'Content-Type' : 'text/html'
            // 'Content-Type' : 'application/json'
        })
        const tableContent = tableTemplate.replace('{{%TABLE_BODY%}}', generateTableRows())
        res.end(home.replace('{{%TABLE_CONTENT%}}', tableContent));
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
