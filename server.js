var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var request = require('request');

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(req, res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req, res);
    }
});

function displayForm(req, res) {
    if (req.url == '/') {
    filePath = "index.html";
  } else {
    filePath = 'output.html';
  }
    fs.readFile(filePath, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}

function processFormFieldsIndividual(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var arr = ['&q.enriched.url.concepts.concept.text=', '&q.enriched.url.enrichedTitle.keywords.keyword.text=',
                '&q.enriched.url.docSentiment.score=>=', '&return=enriched.url.url,enriched.url.title'];
    var url = 'https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=715c521e9c5930540f5420cd31e60f01e188fa42&outputMode=json&start=now-1d&end=now&count=5&q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label=';
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        //console.log(field);
        fields[String(field)] = value;
        url += String(value);
        url += arr.shift();
    });
    //'https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=715c521e9c5930540f5420cd31e60f01e188fa42&outputMode=json&start=now-1d&end=now&count=10&q.enriched.url.enrichedTitle.taxonomy.taxonomy_=|label=business,score=%3E0.4|&return=enriched.url.url,enriched.url.title,enriched.url.text'
    request(String(url), function (error, response, body) {
    //Check for error
    if(error){
        return console.log('Error:', error);
    }

    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    //All is good. Print the body
    body = '<html><head><title>Output</title></head><body><p> Below is the output in JSON format. If the daily limit is exceeded, click below to see a sample output. </p><a href = "http://shreyasgarg.github.io/output.json"> Sample Output </a><p>' + body + '</p></body></html>';
    fs.writeFile('output.html', body, function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');

});
});

    form.on('end', function () {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write('<META http-equiv="refresh" content="0;URL=http://watsonnews.herokuapp.com/output.html">');
        res.end();
    });
    form.parse(req);
}

server.listen(process.env.PORT || 3000);
console.log("server listening on 3000");

/*
http://www.sitepoint.com/creating-and-handling-forms-in-node-js/
http://howtonode.org/deploy-blog-to-heroku
https://scotch.io/tutorials/scraping-the-web-with-node-js
*/