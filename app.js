var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var level = require('levelup');
var db = level('./databaseDirectory');
var bodyParser = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 3000;


// middleware
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(session({ secret: 'random c0okie s3cret', resave:false, cookie: { maxAge: 60000 }}));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
	res.render('home');
});


app.get('/room/:name', function(req, res){
	db.get(req.params.name, function(err, data){
		if(!err){
			if(req.session.pass === data){
				res.render('room',{"name":req.params.name, "confirm":true});
			}else{
				res.render('room', {"name":req.params.name, "confirm":false});
			}
		}else{
			res.send(err);
		}
	});
});

app.post('/room/:name', function(req, res){
		db.get(req.params.name, function(err, data){
			if(req.body.password === data){
				req.session.pass = data;
				res.render('room',{"name":req.params.name, "confirm":true});
			}else{
				res.render('room', {"name":req.params.name, "message":"wrong password!", "confirm":false});
			}
		});
});

app.post('/create-room', function(req, res){
	var roomName = req.body['room-name'];
	req.session.pass = req.body.password;
	db.put(roomName, req.body.password, function(err){
		if(!err){
				res.redirect('/room/' + roomName);
		}else{
			res.send(err);
		}
	});
});

server.listen(port);
