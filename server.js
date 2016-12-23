var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 10001;
var io = require('socket.io').listen(app.listen(process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var zapiska ={};
var currentConnections = {};
var usersarray = [];
var online = 0;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// It is fired when a client tries to connect to the server; Socket.io creates a new socket that we will use to receive or send messages to the client.
io.sockets.on('connection', function (socket) {
socket.broadcast.emit('users', usersarray);
  // console.log("socket connection created");
 //socket.send(socket.id);
	currentConnections[socket.id] = {socket:socket};
	socket.on('setPseudo', function (data) {
		currentConnections[socket.id].Pseudo = data;
		user = {'sessid':socket.id, 'name':data};
		usersarray.push(user);
		online++;
		socket.broadcast.emit('users', usersarray);
	});
	
	socket.on('message', function (message) {
		var data = {'message' : message, 'pseudo' : currentConnections[socket.id].Pseudo};
		socket.broadcast.emit('message', data);
		console.log("user " + currentConnections[socket.id].Pseudo + " send this : " + message);
		
	});
	
	socket.on('typing',function(input){
		var data = {'message' :input, 'pseudo' : currentConnections[socket.id].Pseudo};
		socket.broadcast.emit('message', data);
		console.log(data);
	});
	
	
  socket.on('disconnect', function () {
	  let index=0;
	  usersarray.forEach(function(value,index){
		  if (value.sessid == socket.id) index = index;
	  })
      socket.emit('users',usersarray.splice(index,1));
      online = online - 1;

  });
	
	  // A User starts a path
  socket.on( 'startPath', function( data, sessionId ) {
	
    socket.broadcast.emit( 'startPath', data, sessionId );

  });
  
  

  // A User continues a path
  socket.on( 'continuePath', function( data, sessionId ) {

    socket.broadcast.emit( 'continuePath', data, sessionId );

  });

  // A user ends a path
  socket.on( 'endPath', function( data, sessionId ) {

    socket.broadcast.emit( 'endPath', data, sessionId );

  });  
	
});



app.use(express.static(__dirname + '/public'));

