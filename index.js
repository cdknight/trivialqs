var express = require("express")
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("public"));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
}); 

io.on('connection', function(socket){
    console.log("A user connected.");
    socket.on('disconnect', function(){
        console.log('A user disconnected');
    });
    socket.on('sended', function(val){
        console.log("A user send a response: " + val)
        if (val == 1){
            io.emit('correct', true);
        }
        else {
            io.emit('correct', false)
        }
    });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
    