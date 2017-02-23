const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:rocket@localhost:5432/simpsons';
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'hbs');

var client = new pg.Client(connectionString);
client.connect();

app.get('/', function(req, res) {
    var x = 1000;

while (x > 0) {
    x = x - 1;
}

var query = client.query("SELECT * FROM levels");
//fired after last row is emitted

query.on('row', function(row) {
    console.log(row);
});

query.on('end', function() {
    client.end();
});
    res.render('SimpsonZombie.hbs')
});

app.listen(3000, function() {
    console.log("3000!");
});
