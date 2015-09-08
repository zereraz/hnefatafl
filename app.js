var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var level = require('levelup');
var db = level('./databaseDirectory', { valueEncoding: 'json' });
var sockDb = level('./socketsDb', { valueEncoding: 'json' });
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
    var e = req.query.q;
    switch(e){
        case "rde":
            e = "Room does not exist";
            break;
    }
	res.render('home',{"message":e});
});


app.get('/room/:name', function(req, res){
			db.get(req.params.name, function(err, data){
				if(err){
					if(err.notFound){
						res.redirect('/?q=rde');
					}
				}else{
					if(req.session.pass === data.pass){
						res.render('room',{"name":req.params.name, "confirm":true});
					}else{
						res.render('room', {"name":req.params.name, "confirm":false});
					}
				}
			});
});

app.post('/room/:name', function(req, res){
		db.get(req.params.name, function(err, data){
			if(req.body.password === data.pass){
				req.session.pass = data.pass;
				res.render('room',{"name":req.params.name, "confirm":true});
			}else{
				res.render('room', {"name":req.params.name, "message":"wrong password!", "confirm":false});
			}
		});
});

app.get('/create-room', function(req, res){
	res.redirect('/');
});

app.post('/create-room', function(req, res){
	var roomName = req.body['room-name'];
	db.get(roomName, function(err, data){
		// room does not exist
		if(err){
            var value = {
                'pass': req.body.password,
                'count': 0,
                'gameCount': 0,
                'moves': [],
                'sock': []
            };
			db.put(roomName, value, function(err){
				if(!err){
						req.session.pass = req.body.password;
						req.session.room = roomName;
						res.redirect('/room/' + roomName);
				}else{
					res.send(err);
				}
			});
		}else{
			if(data.pass === req.body.password){
				req.session.pass = req.body.password;
				req.session.room = roomName;
				res.redirect('/room/' + roomName);
			}else{
					res.render('home', {"message":"Room already exists!"});
			}
		}
	});
});


io.on('connection', function(socket){
	console.log('user connected');
	socket.on('my-room', function(data){
        db.get(data.room, function(err, roomData){
            if(!err){
                socket.join(data.room);
                roomData.count += 1;
                console.log(roomData);
                roomData.sock.push(socket.id);
                if(roomData.count == 1){
                    sockDb.put(socket.id, {"room": data.room, "type": "p", "iAm": null} , function(err){
                        if(!err){
                            console.log("socket(master) put in db");                        
                        }else{
                            console.log("err with putting master socket");
                        }
                    });
                    socket.emit('player');                     
                    socket.emit('master');                     
                }else if(roomData.count > 2){
                    sockDb.put(socket.id, {"room":data.room, "type":"s"}, function(err){
                        if(!err){
                            console.log("spec added");
                        }else{
                            console.log("error adding spec");                                
                        }
                    });
                    socket.emit('spectator');
                }else{
                    socket.emit('player');              
                    // 2nd player
                    sockDb.put(socket.id, {"room":data.room, "type":"p", "iAm":null}, function(err){
                        if(!err){
                            console.log("2nd socket put in db");                        
                            io.to(data.room).emit('showDialog');
                        }else{
                            console.log("err with putting master socket");
                        }
                    });

                }
                db.put(data.room, roomData, function(err){
                    if(!err){                    
                        console.log(roomData.count);
                    }else{
                        console.log("join "+"put"+err);
                    }
                });
                socket.broadcast.to(data.room).emit('room-joint', data);                
            }else{
                // room does not exist anymore
                console.log("room does not exist anymore");
            }
        });
		// io.to(data.room).emit('room-joint');
	});

	socket.on('move', function(data){
        db.get(data.room, function(err, roomData){
            if(!err){                
                roomData.moves.push(data);
                console.log(roomData);
                socket.broadcast.to(data.room).emit('move', data);
                // could be race conditions here but I am updating data emitting
                // if some problems are coming then do the safe but less fast way
                db.put(data.room, roomData, function(err){
                    if(!err){
                        console.log("move updated");
                    }else{
                        console.log("move "+"put "+err);
                    }
                });
            }else{
                console.log("move : get : "+err);
            } 
        }); 
		// io.to(data.room).emit('render');
	});

	socket.on('render', function(data){
		io.to(data.room).emit('render');
	});

	socket.on('setIAm', function(data){
        sockDb.get(socket.id, function(err, result){
           if(!err){
             if(result.iAm){
                data.iAm = result.iAm;
                socket.emit('setIAm', {'iAm': result.iAm});
             }else{
                db.get(data.room, function(err, roomData){
                    var opponent;
                    if(socket.id === roomData.sock[0]){
                        opponent = roomData.sock[1];
                    }else{
                        opponent = roomData.sock[0];
                    }
                    sockDb.get(opponent, function(err, sockData){
                        if(!sockData.iAm){
                           sockData.iAm = data.opponent;
                           sockDb.put(opponent, sockData, function(err){
                                if(!err){                                   
                                    socket.emit('setIAm', {'iAm': result.iAm=='swords'?'shield':'swords'});
                                    
                                }
                           });
                        }else{
                            console.log('already set for the opponent');
                        }
                    
                    });            
                });
             
             }
           }
        });
		// io.to(data.room).emit('setIAm', data);
	});

	socket.on('disconnect', function(){
        sockDb.get(socket.id, function(err, data){
            if(data.type=='p'){
                io.to(data.room).emit('playerDisconnect');
            }else if(data.type=='s'){
                io.to(data.room).emit('spectatorDisconnect');
                
            }
            db.get(data.room, function(err, roomData){
                roomData.count-=1;
                if(roomData.count === 0){
                    db.del(data.room, function(err){
                        if(!err){
                            console.log(data.room + " room deleted");
                        }
                    });
                }else{
                    db.put(data.room, roomData, function(err){
                        if(!err){
                            console.log("player/spec disconnected, room count : "+roomData.count);
                        }else{
                            console.log("error/spec in player disconnect");
                        }
                    });
                
                }
            }); 
        });
        console.log('user disconnected');
  });
});


server.listen(port);
