var express = require('express');
var app = express();
var path = require('path');
var sassMiddleware = require('node-sass-middleware');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// adding the sass middleware
app.use(
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/',
    debug: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});