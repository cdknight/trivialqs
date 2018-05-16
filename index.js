var express = require("express")
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs')

var txtpath = process.argv[2];
var questioncontent = fs.readFileSync(txtpath, 'utf-8').toString();

var currentq = 0; 
var correctqs = 0; 

app.use(express.static("public"));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
}); 

io.on('connection', function(socket){
    io.emit('questionlist', getQ(currentq));
    console.log("A user connected.");
    socket.on('disconnect', function(){
        console.log('A user disconnected');
    });
    socket.on('sended', function(val){
        //quick hack
        val -= 1; 
        console.log("A user sent a response: " + val);
        console.log("ans: " + getAns(currentq));

        if (getAns(currentq) == val){
            io.emit('correct', true);
            correctqs += 1;
        }
        else {
            io.emit('correct', false);
        }
        if (currentq + 1 == totalQs()){
            io.emit("end", correctqs);
            correctqs = 0; 
            currentq = -1; //compensation
        }
        currentq += 1;
        io.emit('questionlist', getQ(currentq));
        
    });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
    
function getQ(qid){
    qarr = questioncontent.split("\n\n")
    console.log("qid " + qid)
    return qarr[qid].split("\n")
}

function totalQs(){
    return questioncontent.split("\n\n").length;
}

function getAns(qid){
    qarr = questioncontent.split("\n\n")

    return qarr[qid].split("\n")[qarr[qid].split("\n").length -1];
}