var express = require('express');
var app = express();

var port = process.env.port || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile('index.html');
});

app.listen(port);
