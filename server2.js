//Load the request module
var http = require("http");
var path = require("path");
var mime = require("mime");
var request = require('request');
var fs = require('fs');

//Lets try to make a HTTPS GET request to modulus.io's website.
//All we did here to make HTTPS call is changed the `http` to `https` in URL.
request('https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=715c521e9c5930540f5420cd31e60f01e188fa42&outputMode=json&start=now-1d&end=now&count=10&q.enriched.url.enrichedTitle.taxonomy.taxonomy_=|label=business,score=%3E0.4|&return=enriched.url.url,enriched.url.title,enriched.url.text', function (error, response, body) {
    //Check for error
    if(error){
        return console.log('Error:', error);
    }

    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }

    //All is good. Print the body
    var json = body;
    fs.writeFile('output.json', json, function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})
});
function serverWorking(response, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response)
        } else {
          sendPage(response, absPath, data);
        }
      });
    } else {
      send404(response);
    }
  });
}
function sendPage(response, filePath, fileContents) {
  response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}
function send404(response) {
  response.writeHead(404, {"Content-type" : "text/plain"});
  response.write("Error 404: resource not found");
  response.end();
}
http.createServer(function(request, response) {
  var filePath = false;

  if (request.url == '/') {
    filePath = "index.html";
  } else {
    filePath = request.url;
  }
  var absPath = "./" + filePath;
  serverWorking(response, absPath);
}).listen(3000)