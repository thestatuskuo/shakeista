var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
  res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});