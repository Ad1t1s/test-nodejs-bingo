var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    // socket.broadcast.emit('hi');
    console.log('a user connected');
    io.emit('chat message', 'a user connected' );
    socket.on('disconnect', function(){
      console.log('user disconnected');
    io.emit('chat message', 'a user disconnect' );
    });
  });

  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log(msg);
         let minutes = new Date().getMinutes();
         if (minutes < 10) {minutes = "0" + minutes;}
         let seconds = new Date().getSeconds();
         if (seconds < 10) {seconds = "0" + seconds;}
         let TimeForChat = new Date().getHours()+":"+minutes+":"+ seconds
      io.emit('chat message', TimeForChat+ "  " + msg );
    });
  });

  io.emit('some event', { for: 'everyone' });



http.listen(3000, function(){
  console.log('listening on *:3000');
});