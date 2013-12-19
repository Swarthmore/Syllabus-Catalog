var http = require('http'),
	https = require('https'),
	app = http.createServer(handler)
  	io = require('socket.io').listen(app),
  	url = require('url'),
  	fs = require('fs'),
  	iniparser = require('iniparser'),
  	_und = require("underscore"),
  	static = require('node-static'),
  	mongo = require('mongodb'),
  	async = require('async'),
  	moment = require('moment'),
  	util = require('util'),
  	utility = require("./utility"),
  	parseString = require('xml2js').parseString;


var twit;
var config;
var fileserver;


var MongoClient = mongo.MongoClient;
var BSON = mongo.BSONPure;

var CONFIG_FILE = './syllabus.conf';



io.set('log level', 2); // reduce logging
load_config();


function load_config() {
	async.series([
		function(callback) {
			load_config_file(CONFIG_FILE, callback);
		}, 
		
		function(callback) {
			connect_to_db(config, callback);
		},
					
		function(callback) {
			start_server(config, callback);
		}	

	]);
}	



function load_config_file(config_file, callback) {
	iniparser.parse(config_file, function(err,data) {
		config = data;
		utility.update_status("Opened config file");
		callback(err, config);
	});
}

function start_server(config_file, callback) {
	fileServer = new static.Server('./public', { cache: 1 });
	app.listen(config.app.port);
	utility.update_status("Started server");
	callback(null, config);
}



function connect_to_db(config, callback) {

	utility.update_status("Connecting to database");
	MongoClient.connect('mongodb://127.0.0.1:27017/syllabus-catalog', function(err, db) {
		if(err) {utility.update_status("Can't connect to database: " + err);}

		config.db = db;
		callback(err, config);   
	});

}




function handler (request, response) {

	utility.update_status(request.url);
	var data = "";
	
	if (request.method == "GET") {

		fileServer.serve(request, response);
	
	} else if (request.method == "POST") {
	
		// Is this an Instagram post?  If so, collect the data
		if (request.url.indexOf("/save_syllabus") == 0) {
		
			// Save POST data as it arrives
			request.on("data", function(chunk) {
				data += chunk;
			});
			
			// When Instagram request is done, acknowledge it
			request.on("end", function() { 
				utility.update_status(data);
				
				data = JSON.parse(data);		// Convert to JSON
				
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write("Save syllabus request received");
				response.end(); 
			});	
			// End of handling Instagram posts
			
		} else {
		
			// We don't know how to handle this type of request
			response.writeHead(501, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ message: 'not implemented' }));	
		}
	}
}

io.sockets.on('connection', function(socket) {

	utility.update_status("Got a socket connection");
			
	socket.on('search_oclc', function (data) {
		utility.update_status("Search OCLC for: " + data.q);
		
		http.get("http://www.worldcat.org/webservices/catalog/search/opensearch?q=" + data.q + 
			"&format=atom&cformat=mla&count=" + 
			config.OCLC.search_results_count + 
			"&wskey=" + config.OCLC.wskey, function(res) {

			var pageData = "";
		
		
			res.on('error', function(e) {
				console.log("Error doing WorldCat search: " + e.message);
			});
	
	
			res.on('data', function (chunk) {
				pageData += chunk;
			});


			res.on('end', function(){
				utility.update_status("Got response from WorldCat search: " + res.statusCode);
				
				// Parse XML data from WorldCat search
				parseString(pageData, function (err, result) {
				
					if (err) {
						utility.update_status("Error parsing XML from Worldcat search: " + err);
						return;
					}
					
					// Add week number to result
					result.week_number = data.week;
										
    				utility.update_status(util.inspect(result, false, null));
    				socket.emit("worldcat_search_results", result);
				});
				
			});
		
		
	});
	});
	

	
	
});

