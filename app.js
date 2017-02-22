const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
    res.render('SimpsonZombie.hbs')
});

app.listen(3000, function() {
    console.log("3000!");
});
