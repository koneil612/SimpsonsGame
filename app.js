const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const session = require('client-sessions');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:@localhost:5432/simpsons';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static("public"));
app.use(session({
    cookieName: 'session',
    secret: 'wooooooooo'
}));
app.set('view engine', 'hbs');

var client = new pg.Client(connectionString);
client.connect();

app.get('/game', function(req, res) {
    // ヽ(´ー｀)ノ
res.render('SimpsonZombie.hbs')

});

app.get('/', function(req, res) {
    res.render('home.hbs')
});

app.get('/highscores', function(req, res, next) {
    client.query("SELECT * FROM scores where score > 0 order by score desc limit 10", function(err, results){
        if (err){
            throw err;
        }
        var scores = []
        for (var i = 0; i < results.rows.length; i++){
            scores.push(results.rows);
        }
        console.log(scores);
        res.render('scores.hbs', {scores: scores})
    });
})

app.post('/signin', function(req, res){
    var name = req.body.name;
    req.session.name = name;
    console.log(req.session.name);
    res.redirect('/game')
})

app.get('/signup', function(req, res) {
    res.render('signup.hbs')
})

app.get('/get_zombie', function(req, res) {
    //console.log(req);
    var level = req.query.level;
    client.query("SELECT * FROM zombies", function(err, results) {
       if (err) {
           throw err;
       }
       var zombies;
       var number = Math.round(Math.random()* results.rows.length-1);
    //    console.log("random number is " + number);
       var img = results.rows[number].img_path;
    //    console.log("req level is "+level);
       client.query("SELECT * FROM levels WHERE level =" + level, function(err, results) {
        //    console.log("level info:");
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

// DONE ヽ(´▽`)/
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
        // console.log(data);
        res.json(data);
    });
});

app.post('/set_score', function(req, res) {
    var score = req.body.score;
    client.query("INSERT INTO scores(name, score) VALUES ('" + req.session.name + "', '" + score + "')", function(err, results) {
        if (err){
            throw err;
        }
    });
    req.session.reset();
})

app.listen(3000, function() {
    console.log("3000!");
});

// I don't even know why I added this
