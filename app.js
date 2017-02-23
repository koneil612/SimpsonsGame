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

// var query = client.query("SELECT * FROM levels");
//fired after last row is emitted
 client.query("SELECT * FROM zombies", function(err, results) {
    if (err) {
        throw err;
    }
    console.log(results.rows);
    // res.send(results.rows); // assumes 'results.rows' can be serialized to JSON
  });

// query.on('row', function(row) {
//     console.log(row);

    res.render('SimpsonZombie.hbs')
});


app.listen(3000, function() {
    console.log("3000!");
});

// query.on('end', function() {
//     client.end();
// });
