var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var AllBarrelWithNumber = [];
var userBoard = {};
var lowerBound = 0;
var upperBound = 75; 
var column = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// IF will be more then 1 user in app
// io.on('connection', function(socket){
//     // console.log('a user connected');
//     io.emit('chat message', 'a user connected' );
//     socket.on('disconnect', function(){
//       // console.log('user disconnected');
//     io.emit('chat message', 'a user disconnect' );
//     });
//   });

  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      if (msg === "NEWGAME") {
        AllBarrelWithNumber = [];
        column = StartNewGame(lowerBound,upperBound);
        userBoard = RandomBoard();
        io.emit('chat message', JSON.stringify(userBoard) );
        // console.log(userBoard);
      } else if (msg === "NEWNUMBER") {
        if (column.length) {
          // for (let v = 0; v < 75; v++) {
            barrelWithNumber = getNewNumber(column);
            io.emit('chat message', "NEWNUMBER" + barrelWithNumber.toString() );
            AllBarrelWithNumber[AllBarrelWithNumber.length] = barrelWithNumber;
            // console.log(AllBarrelWithNumber);
          // }
        }

      } else if (msg === "BINGO") {
        if (CheckBoard(userBoard)) {
          io.emit('chat message', "CONGRATULATIONS YOU WON THE GAME!!!" );
        } else { io.emit('chat message', "YOU NOT WIN YET" );}
      } else {
        // console.log(msg);
        let TimeForChat = TimeInChat();
        io.emit('chat message', TimeForChat+ "  " + msg );
      }

    });
  });

  io.emit('some event', { for: 'everyone' });

  function TimeInChat() {
    let minutes = new Date().getMinutes();
    if (minutes < 10) {minutes = "0" + minutes;}
    let seconds = new Date().getSeconds();
    if (seconds < 10) {seconds = "0" + seconds;}
    let TimeForChat = new Date().getHours()+":"+minutes+":"+ seconds
    return TimeForChat;
  }

  function StartNewGame(lowerBound,upperBound) {
    for (let i = lowerBound; i < upperBound; i++) {
      column[i] = i;
    }
    return column;
  }

  function RandomBoard() {
    let b = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] ;
    let i = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] ;
    let n = [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45] ;
    let g = [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60] ;
    let o = [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75] ;
    let bmass = [];
    let imass = [];
    let nmass = [];
    let gmass = [];
    let omass = [];

    for (let q = 0; q < 5; q++) {
      let nubmerOfElem = Math.floor(Math.random()*b.length);
      bmass[q] = b[nubmerOfElem];
      imass[q] = i[nubmerOfElem];
      nmass[q] = n[nubmerOfElem];
      gmass[q] = g[nubmerOfElem];
      omass[q] = o[nubmerOfElem];
      b.splice(nubmerOfElem, 1);
      i.splice(nubmerOfElem, 1);
      n.splice(nubmerOfElem, 1);
      g.splice(nubmerOfElem, 1);
      o.splice(nubmerOfElem, 1);
      if (q === 2) {nmass[q] = "FREE";}
    }
    userBoard['b'] = bmass;
    userBoard['i'] = imass;
    userBoard['n'] = nmass;
    userBoard['g'] = gmass;
    userBoard['o'] = omass;
    return userBoard;
  }

  function getNewNumber(val) { 
    let nubmerOfElem = Math.floor(Math.random()*val.length);
    randomItem = val[nubmerOfElem];
    column.splice(nubmerOfElem, 1);
    // console.log(randomItem);
    return randomItem;
  }

  function CheckBoard(userBoard) {
    // console.log(userBoard);
    let bmass = userBoard['b'];
    let imass = userBoard['i'];
    let nmass = userBoard['n'];
    let gmass = userBoard['g'];
    let omass = userBoard['o'];

    for (let l = 0; l < AllBarrelWithNumber.length; l++) {
      switch (true) {
        case (AllBarrelWithNumber[l] <= 15):
          for (let k = 0; k < bmass.length; k++) {
            if (bmass[k] === AllBarrelWithNumber[l]){
              bmass.splice(k, 1);
            }
          }
        break;
        case (AllBarrelWithNumber[l] <= 30):
        for (let k = 0; k < imass.length; k++) {
          if (imass[k] === AllBarrelWithNumber[l]){
            imass.splice(k, 1);
          }
        }
        break;
        case (AllBarrelWithNumber[l] <= 45):
        for (let k = 0; k < nmass.length; k++) {
          if (nmass[k] === AllBarrelWithNumber[l]){
            nmass.splice(k, 1);
          } else if (nmass[k] === 'FREE') {
            nmass.splice(k, 1);
          }
        }
        break;
        case (AllBarrelWithNumber[l] <= 60):
        for (let k = 0; k < gmass.length; k++) {
          if (gmass[k] === AllBarrelWithNumber[l]){
            gmass.splice(k, 1);
          }
        }
        break;
        case (AllBarrelWithNumber[l] <= 75):
        for (let k = 0; k < omass.length; k++) {
          if (omass[k] === AllBarrelWithNumber[l]){
            omass.splice(k, 1);
          }
        }
        break;
      }      
    }
     if (bmass.length === 0 && imass.length === 0 && nmass.length === 0 && gmass.length === 0 && omass.length === 0) {return true;} else { return false;}
  }


http.listen(3000, function(){
  console.log('listening on *:3000');
});