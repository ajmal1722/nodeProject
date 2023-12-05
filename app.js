const fs = require('fs');
const http = require('http');
const querystring = require('querystring')

const home = fs.readFileSync('./index.html', 'utf-8');
const form = fs.readFileSync('./form.html', 'utf-8');
const tableTemplate = fs.readFileSync('./table.html', 'utf-8')
const jsonData = JSON.parse(fs.readFileSync('./Datas/data.json', 'utf-8'))

let rowCounter = jsonData.length + 1;

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
                        <form action="/edit" method="get">
                            <button style="width: 100px" type="submit" class="btn btn-success mb-2" onclick="editRow(${entry.no})">Edit</button><br>                       
                        </form>
                        <form action="/delete" method="get">
                            <button style="width: 100px" type="submit" class="btn btn-danger" onclick="deleteRow(${entry.no})">Delete</button>                       
                        </form>
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
        
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end',() => {
            const formData = querystring.parse(body);

            formData.no = rowCounter++; 

            jsonData.push(formData)
            fs.writeFileSync('./Datas/data.json', JSON.stringify(jsonData, null, 2));

            res.writeHead(200, {'Content-Type' : 'text-plain'});
            res.end(form);
        })

    } else if (path.startsWith('/delete') || path.startsWith('/delete?')) {
        
        const entryNum = parseInt(querystring.parse(path.split('?')[1]).entryNumber);
        console.log(entryNum)

    const index = jsonData.findIndex(entry => entry.no === entryNum);
    if (index !== -1) {
        jsonData.splice(index, 1);
        fs.writeFileSync('./Datas/data.json', JSON.stringify(jsonData, null, 2));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Entry deleted successfully');
    }

    } else if (path.startsWith('/edit') || path.startsWith('/edit?')) {
        
        res.end('edit button works');
    }
     else {
        res.writeHead(404, {
            'Content-Type' : 'text/html'
        })
        res.end('error 404 : Page not found');
    }
})

server.listen(8000,'127.0.0.1', () => {
    console.log('server has created')
})
