/* 
 * Edited by Moongazer
 */

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200);
  res.write('Hello World!!!');
  res.end();
}).listen(8080, function(){
    console.log("Server running at http://localhost:8080/");
});

