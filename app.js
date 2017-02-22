const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'hbs');

mongoose.connect('mongodb://localhost/simpsons');

app.get('/', function(req, res) {
    // var number = Math.round(Math.random()* 21);
    // zombies.findOne({number: number});
    res.render('SimpsonZombie.hbs')
});

app.listen(3000, function() {
    console.log("3000!");
});
