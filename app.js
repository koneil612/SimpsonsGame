const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:rocket@localhost:5432/simpsons';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static("public"));
app.set('view engine', 'hbs');

var client = new pg.Client(connectionString);
client.connect();

app.get('/', function(req, res) {


res.render('SimpsonZombie.hbs')

});

app.get('/get_zombie', function(req, res) {
    //console.log(req);
    var level = req.query.level;
    client.query("SELECT * FROM zombies", function(err, results) {
       if (err) {
           throw err;
       }
       var zombies;
       var number = Math.round(Math.random()* results.rows.length-1);
       console.log("random number is " + number);
       var img = results.rows[number].img_path;
       console.log("req level is "+level);
       client.query("SELECT * FROM levels WHERE level =" + level, function(err, results) {
           console.log("level info:");
        //    console.log(results);
           if (err) {
               throw err;
           }
           var data = {
                img:img,
                speed:results.rows[0].speed
           };
           res.json(data); // assumes 'results.rows' can be serialized to JSON
       });


     });
});

// TODO: not sure if I'm not sending the data correctly, or not calling it correctly
app.get('/get_level', function(req,res) {
    var level = req.query.stage;
    // console.log(res);
    client.query("SELECT * FROM levels WHERE level =" + level, function(err, result) {
        // console.log(result);
        if (err) {
            throw err;
        }
        var data = {
            image: result.rows[0].background,
            clock: result.rows[0].timer,
            zAmount: result.rows[0].amount
        }
        console.log(data);
        res.json(data);
    });
});

app.listen(3000, function() {
    console.log("3000!");
});

// query.on('end', function() {
//     client.end();
// });
