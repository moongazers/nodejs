/* 
 * Edited by Moongazer
 */
var express = require('express');

//initialize express app
var app = express();

var http = require('http');

//create express server
var server = http.createServer(app);

var io = require('socket.io')(server);

// A convenient method from .request().it sets the method to GET and calls req.end() automatically.
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


//store msgs/names
var messages = [];
var nameArr = [];
var storeMessage = function(name, data){
    messages.push({name: name, data: data});

    // save less than 10 old msgs
    if(messages.length > 10) {
        messages.shift(); // delete the first msg
    }
};

//add a connection listener
io.on('connection', function(client){
    console.log("Client connected...");
    
    client.on('join', function(name){
        //retrieve the nickname
        client.nickname = name;

        //post already existed user
        for(var index in nameArr){
            client.emit("addName", nameArr[index]);
        }    
        
        //post new user
        client.broadcast.emit("addName", name);
        client.emit("addName", name);    
        
        //post old msgs
        messages.forEach(function(message) {
            client.emit("messages", "<b>" + message.name + "</b>:" + " <span>"+ message.data + "</span>");

        });    

        //post joined notice msg
        client.broadcast.emit("joined", "<i><b>" + name + " </b>" + "joined the room</i>");
        client.emit("joined", "<i><b>" + name + " </b>" + "<i>joined the room</i>");
            
        //add user to nameArr , for new user
        if(nameArr.indexOf(name) === -1){
            nameArr.push(name);
        }    
    });
    
    client.on('messages', function(message){
        var nickname = client.nickname;
       
        console.log(nickname + ": "+ message);
        
        client.broadcast.emit("messages", "<b>" + nickname + "</b>:" + " <span>"+ message + "</span>");
        client.emit("messages", "<b>" + nickname + "</b>:" + " <span>"+ message + "</span>");
        
        //store msg
        storeMessage(nickname, message);
    });
    
    client.on('disconnect', function(){
        var nickname = client.nickname;
        
        //del name from nameArr
        var index = nameArr.indexOf(nickname);
        nameArr.splice(index, 1);
        
        client.broadcast.emit("messages", "<b>" + nickname + " </b>" + "<i>left the room</i>");
        client.broadcast.emit("delName", nickname);
    });
    
});


server.listen(8080);