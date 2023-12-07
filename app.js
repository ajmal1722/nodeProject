const { error } = require('console');
const fs = require('fs');
const http = require('http');
const querystring = require('querystring')

const home = fs.readFileSync('./index.html', 'utf-8');
const form = fs.readFileSync('./form.html', 'utf-8');
const tableTemplate = fs.readFileSync('./table.html', 'utf-8')
const jsonData = JSON.parse(fs.readFileSync('./Datas/data.json', 'utf-8'))
const editedForm = fs.readFileSync('./editedForm.html', 'utf-8')

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

let array = [];

const server = http.createServer(function(req, res) {
    let path = req.url;
   
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

    }  else if (path === '/editedForm' || path.startsWith('/editedForm?')) {
        // Extract the entryNumber from the URL parameters
        const entryNum = parseInt(querystring.parse(path.split('?')[1]).entryNumber);
      
        // Find the corresponding entry in your data
        const entry = jsonData.find(entry => entry.no === entryNum);
      
        if (entry) {
          // Render the editedForm page with the entry data
          // Replace this part with your actual rendering logic
          const editedFormWithData = editedForm
            .replace('{{%NAME%}}', entry.name)
            .replace('{{%AGE%}}', entry.age)
            .replace('{{%PHONE%}}', entry.phone)
            .replace('{{%EMAIL%}}', entry.email)
            .replace('{{%GENDER%}}', entry.gender);
      
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(editedFormWithData);
        } else {
          // Handle the case where the entry is not found
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('Error 404: Entry not found');
        }
      } else if (path === '/submit' || path === '/submit?'){
        
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end',() => {
            const formData = querystring.parse(body);

            array = jsonData;

            formData.no = array.length + 1;
            // formData.no = rowCounter++; 
            array.push(formData)

            // jsonData.push(formData)
            fs.writeFileSync('./Datas/data.json', JSON.stringify(array, null, 2));

            res.writeHead(200, {'Content-Type' : 'text-plain'});
            res.end(form);
        })

    } else if (path.startsWith('/delete?') && req.method === 'DELETE') {
        
        const entryNum = parseInt(querystring.parse(path.split('?')[1]).entryNumber);

    const index = jsonData.findIndex(entry => entry.no === entryNum);  
    if (index !== -1) {
        const deletedEntry = jsonData.splice(index, 1);

        for (let i = index; i < jsonData.length; i++){
            jsonData[i].no--;
        }

        fs.writeFileSync('./Datas/data.json', JSON.stringify(jsonData, null, 2));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Entry deleted successfully');
    }

    } else if (path.startsWith('/edit?') || path.startsWith('/edit')) {
       
        try {
            const entryNum = parseInt(querystring.parse(path.split('?')[1]).entryNumber);
        
            const index = jsonData.findIndex(x => x.no === entryNum);
        
            if (index !== -1) {
                let editData = jsonData[index];
        
                console.log('Entry being edited:', editData);
                const formWithValue = form.replace('{{%NAME%}}', editData.name)
                                            .replace('{{%AGE%}}', editData.age)
                                            .replace('{{%PHONE%}}', editData.phone)
                                            .replace('{{%EMAIL%}}', editData.email)
                                            .replace('{{%GENDER%}}', editData.gender);
        
                fs.writeFileSync('./Datas/data.json', JSON.stringify(jsonData, null, 2));
                res.writeHead(302, { 'Location': '/'  });
                console.log('delete request received')
                res.end();
            }
        } catch (error) {
            console.log('error message :', error);
        }
        

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
