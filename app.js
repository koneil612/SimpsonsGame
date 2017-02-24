const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:@localhost:5432/simpsons';
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'hbs');

var client = new pg.Client(connectionString);
client.connect();

app.get('/', function(req, res) {


res.render('SimpsonZombie.hbs')

});

app.get('/get_zombie', function(req, res) {
    client.query("SELECT * FROM zombies", function(err, results) {
       if (err) {
           throw err;
       }
       var zombies;
       var number = Math.round(Math.random()* results.rows.length);
       console.log(results.rows);
       res.json(results.rows[number].img_path); // assumes 'results.rows' can be serialized to JSON

     });
})

// TODO: not sure if I'm not sending the data correctly, or not calling it correctly
app.post('/get_level', function(req,res) {
    var level;
    console.log();
    client.query("SELECT * FROM levels WHERE level = level", function(err, result) {
        if (err) {
            throw err;
        }
        res.send(result.rows);
    })
})

app.listen(3000, function() {
    console.log("3000!");
});

// query.on('end', function() {
//     client.end();
// });
