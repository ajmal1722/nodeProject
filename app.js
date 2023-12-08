const fs = require("fs");
const http = require("http");
const querystring = require("querystring");

const home = fs.readFileSync("./index.html", "utf-8");
const form = fs.readFileSync("./form.html", "utf-8");
const tableTemplate = fs.readFileSync("./table.html", "utf-8");
const editedForm = fs.readFileSync("./editedForm.html", "utf-8");
const editedTableTemplate = fs.readFileSync('./editTable.html', 'utf-8')

let jsonData = JSON.parse(fs.readFileSync("./Datas/data.json", "utf-8"));

function generateTableRows() {
  return jsonData
    .map(
      (entry) => `
    <tr>
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
    )
    .join("");
}

function handleRequest(req, res) {
  const path = req.url;

  if (path === "/" || path === "/home" || path === "/home?") {
    const tableContent = tableTemplate.replace(
      "{{%TABLE_BODY%}}",
      generateTableRows()
    );
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(home.replace("{{%TABLE_CONTENT%}}", tableContent));

  } else if (path === "/form" || path === "/form?") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(form);

  } else if (path === "/editedForm" || path.startsWith("/editedForm?")) {
    const entryNum = parseInt(
      querystring.parse(path.split("?")[1]).entryNumber
    );
    const entry = jsonData.find((entry) => entry.no === entryNum);

    if (entry) {
      const editedFormWithData = editedForm
        .replace("{{%ENTRY_NUMBER%}}", entry.no)
        .replace("{{%NAME%}}", entry.name)
        .replace("{{%AGE%}}", entry.age)
        .replace("{{%PHONE%}}", entry.phone)
        .replace("{{%EMAIL%}}", entry.email)
        .replace("{{%GENDER%}}", entry.gender);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(editedFormWithData);

    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("Error 404: Entry not found");
    }

  } else if (path === "/submit" || path === "/submit?") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const formData = querystring.parse(body);
      formData.no = jsonData.length + 1;
      jsonData.push(formData);
      fs.writeFileSync("./Datas/data.json", JSON.stringify(jsonData, null, 2));

      res.writeHead(200, { "Content-Type": "text-plain" });
      res.end(form);
    });

  } else if (path.startsWith("/delete?") && req.method === "DELETE") {
    const entryNum = parseInt(
      querystring.parse(path.split("?")[1]).entryNumber
    );
    const index = jsonData.findIndex((entry) => entry.no === entryNum);

    if (index !== -1) {
      jsonData.splice(index, 1);
      for (let i = index; i < jsonData.length; i++) {
        jsonData[i].no--;
      }

      fs.writeFileSync("./Datas/data.json", JSON.stringify(jsonData, null, 2));
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Entry deleted successfully");
    }
    
  } else if (path.startsWith('/editSubmit') || path.startsWith('/editSubmit?')) {
      try {
        const entryNum = parseInt(querystring.parse(path.split("?")[1]).no);
      
        const entry = jsonData.find((entry) => entry.no === entryNum);

        if (entry) {
          const editedFormWithData = tableTemplate
            .replace("{{%EDITNO%}}", entry.no)
            .replace("{{%EDITNAME%}}", entry.name)
            .replace("{{%EDITAGE%}}", entry.age)
            .replace("{{%EDITPHONE%}}", entry.phone)
            .replace("{{%EDITEMAIL%}}", entry.email)
            .replace("{{%EDITGENDER%}}", entry.gender);
    
          res.writeHead(200, { "Content-Type": "text-plain" });
          res.end(home);
    
        }
       
      } catch (error) {
        console.error('Error message:', error.message);
      }

  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("Error 404: Page not found");
  }
}

const server = http.createServer(handleRequest);

server.listen(8000, "127.0.0.1", () => {
  console.log("Server has started");
});
