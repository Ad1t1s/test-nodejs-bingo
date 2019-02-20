const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var AllBarrelWithNumber = [];
var userBoard = {};
const lowerBound = 0;
const upperBound = 75; 
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
		if (msg === 'NEWGAME') {
			AllBarrelWithNumber = [];
			column = StartNewGame(lowerBound,upperBound);
			userBoard = RandomBoard();
			io.emit('chat message', JSON.stringify(userBoard) );
		} else if (msg === 'NEWNUMBER') {
			if (column.length) {
				// for (let v = 0; v < 75; v++) {
				const barrelWithNumber = getNewNumber(column);
				io.emit('chat message', 'NEWNUMBER' + barrelWithNumber.toString() );
				AllBarrelWithNumber[AllBarrelWithNumber.length] = barrelWithNumber;
				// }
			}

		} else if (msg === 'BINGO') {
			if (CheckBoard(userBoard)) {
				io.emit('chat message', 'CONGRATULATIONS YOU WON THE GAME!!!' );
			} else { io.emit('chat message', 'YOU NOT WIN YET' );}
		} else {
			let TimeForChat = TimeInChat();
			io.emit('chat message', TimeForChat+ '  ' + msg );
		}

	});
});

io.emit('some event', { for: 'everyone' });

const TimeInChat = () => new Date().toISOString().split('T')[1].split('.').shift();


function StartNewGame(lowerBound,upperBound) {
	for (let i = lowerBound; i < upperBound; i++) {
		column[i] = i+1;
	}
	return column;
}

function RandomBoard() {
	const data = new Array(5).fill(null).map(
		(_, cIdx) => new Array(15).fill(null).map(
			(_, rIdx) => (cIdx) * 15 + (rIdx+1)
		).sort(() => Math.random()-0.5).slice(0, 5)
	);
	data[2][2] = 'FREE';
	return data;
}

const  getNewNumber = val => val.splice(Math.floor(Math.random()*val.length), 1)[0];

function CheckBoard(userBoard) {
	const user = new Set(Array.prototype.concat.apply([], userBoard));
	user.delete('FREE');
	AllBarrelWithNumber.forEach(num => user.delete(num));
	return user.size === 0;
}


http.listen(3000, function(){
	console.log('listening on *:3000');
});