const fs = require('fs');
const http = require('http');
const querystring = require('querystring')

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
                    <td>${entry.phone}</td>
                    <td>${entry.email}</td>
                    <td>${entry.gender}</td>
                    <td>
                        <button style= "width : 100px" type="button" class="btn btn-success mb-2" onclick="editRow(${entry.no})">Edit</button><br>
                        <button style= "width : 100px" type="button" class="btn btn-danger" onclick="deleteRow(${entry.no})">Delete</button>
                    </td>
                </tr>`
    }).join('')
            
}

const server = http.createServer(function(req, res) {
    let path = req.url;
    console.log(path)
    if (path === '/' || path === '/home?' || path === '/home'){
        res.writeHead(200, {
            'Content-Type' : 'text/html'
            // 'Content-Type' : 'application/json'
        })
        const tableContent = tableTemplate.replace('{{%TABLE_BODY%}}', generateTableRows())
        res.end(home.replace('{{%TABLE_CONTENT%}}', tableContent));

    } else if (path === '/form?' || path === '/form') {
        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        res.end(form);

    } else if (path === '/submit' || path === '/submit?'){
        console.log("req.method");
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end',() => {
            const formData = querystring.parse(body);

            jsonData.push(formData)
            fs.writeFileSync('./Datas/data.json', JSON.stringify(jsonData, null, 2));

            res.writeHead(200, {'Content-Type' : 'text-plain'});
            res.end('Form submission Successful');
        })

    } else {
        res.writeHead(404, {
            'Content-Type' : 'text/html'
        })
        res.end('error 404 : Page not found');
    }
})

server.listen(8000,'127.0.0.1', () => {
    console.log('server has created')
})
