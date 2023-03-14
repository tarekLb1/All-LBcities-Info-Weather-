//Create an API for Users Name & Phone (get & Post) That has "users.xlsx" As data Base
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var XLSX = require('xlsx');
const cors = require('cors')
// const jsonfile = require('jsonfile');
const PORT = process.env.PORT || 3030;

var wb = XLSX.readFile('users.xlsx');
var ws = wb.Sheets["usersSheet"];
var users = XLSX.utils.sheet_to_json(ws);

 app.use(cors({
   origin: 'https://tareklb1.github.io/All-LBcities-Info-Weather-/'
 }));

app.get('/users', function (req, res) {
  res.send(users)
})

app.use(bodyParser.json());

app.post('/adduser', (req, res) => {
  console.log(req.body);
  XLSX.utils.sheet_add_aoa(ws, [[req.body.name, req.body.phone]], { origin: -1 });
  XLSX.writeFile(wb, "users.xlsx");
  
  users= XLSX.utils.sheet_to_json(ws);
  res.send(users)
})

app.listen(PORT)