var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var level = require('levelup');
var db = level('./databaseDirectory');
var compression = require('compression');
var bodyParser = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 3000;


app.use(compression());
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
	if(req.session.room === req.params.name){
		db.get(req.params.name, function(err, data){
			if(!err){
				if(data){
					if(req.session.pass === data){
						res.render('room',{"name":req.params.name, "confirm":true});
					}else{
						res.render('room', {"name":req.params.name, "confirm":false});
					}
				}else{
					res.send("Room does not exist");
				}
			}else{
				res.redirect('/');
			}
		});
	}else{
		// leave room/logout only then can u make a new room
		res.redirect('/room/'+req.session.room);
	}
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
	db.get(roomName, function(err, data){
		// room does not exist
		if(err){
			db.put(roomName, req.body.password, function(err){
				if(!err){
						req.session.pass = req.body.password;
						req.session.room = roomName;
						res.redirect('/room/' + roomName);
				}else{
					res.send(err);
				}
			});
		}else{
			res.render('home', {"message":"Room already exists!"});
		}
	});
});


io.on('connection', function(socket){
  var room;
	socket.on('my-room', function(data){
		room = data.room;
		socket.join(room);
		io.to(room).emit('room-joint');
	});
	socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


server.listen(port);
