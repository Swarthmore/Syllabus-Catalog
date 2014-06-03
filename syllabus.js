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
  	parseString = require('xml2js').parseString,
  	formidable = require('formidable');


var twit;
var config;
var fileserver;


var MongoClient = mongo.MongoClient;
var BSON = mongo.BSONPure;

var CONFIG_FILE = './syllabus.conf';
var get_syllabus_req_regex = /\/api\/syllabi\/([A-Za-z0-9]*)/;


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
	MongoClient.connect("mongodb://" + config.DB.db_host + ":27017/syllabus-catalog", function(err, db) {
		if(err) {utility.update_status("Can't connect to database: " + err);}

		config.db = db;
		callback(err, config);   
	});

}




function handler (request, response) {

	utility.update_status(request.method + ": " +request.url);
	var data = "";

	
	if (request.method == "GET") {

		// Check for special requests.  Otherwise, serve up requested file
		if (request.url == "/") {
		
			request.url = "/index.html";
			fileServer.serve(request, response);
		
		} else if (request.url == "/api/syllabi") {
			 //Get a list of all syllabi
			send_syllabi(request, response);
	
		} else if (request.url.match(get_syllabus_req_regex)) {
		
			// Send back syllabi listing
			get_syllabus(request, response);
		
		} else {
			// Serve up file
			fileServer.serve(request, response);
		}
	
	} else if (request.method == "POST") {
	
		if (req.url == '/upload') {
    		// parse a file upload
    		var form = new formidable.IncomingForm();

			form.parse(req, function(err, fields, files) {
			  res.writeHead(200, {'content-type': 'text/plain'});
			  res.write('received upload:\n\n');
			  res.end(util.inspect({fields: fields, files: files}));
			});

			return;
			
  		} else if (request.url.indexOf("/api/syllabi") == 0) {
	
			// Is this a a request to save a  newsyllabus?  If so, collect the data
		
			// Save POST data as it arrives
			request.on("data", function(chunk) {
				data += chunk;
			});
			
			// When save syllabus request is done, acknowledge it
			request.on("end", function() { 
				utility.update_status(data);
				
				data = JSON.parse(data);		// Convert to JSON
				
				// If _id is present, convert it to object
				if (typeof data._id !== 'undefined') {
					data._id = new mongo.ObjectID(data._id)
				}
				
				var _id = config.db.collection('syllabi').save(data, function(err, doc) {
					
					message = {};
					
					if (err) {
						message.status = "Error saving syllabus to database: " + err;
					} else {
					
						if (doc == 1) {
							message.status = "Successfully updated syllabus in database";
						} else {
							message.status = "Successfully saved syllabus to database (" + doc._id + ")";
							message.syllabus_id = doc._id
						}

					}
				
					response.writeHead(200, {"Content-Type": "application/json"});
					response.write(JSON.stringify(doc));
					response.end(); 
			
					utility.update_status(message.status);
			
				});	// End save syllabus to db
			
			
			}); // End of handling save syllabus posts	
		}

	} else if (request.method == "PUT") {
	
		// Is this a a request to save the syllabus?  If so, collect the data
		if (request.url.indexOf("/api/syllabi") == 0) {
		
			// Save POST data as it arrives
			request.on("data", function(chunk) {
				data += chunk;
			});
			
			// When save syllabus request is done, acknowledge it
			request.on("end", function() { 
				utility.update_status(data);
				
				data = JSON.parse(data);		// Convert to JSON
				
				// If _id is present, convert it to object
				if (typeof data._id !== 'undefined') {
					data._id = new mongo.ObjectID(data._id)
				}

				// Add institution to data saved in database
				data.institution = config.app.institution_name;
				
				var _id = config.db.collection('syllabi').save(data, function(err, doc) {
					
					message = {};
					
					if (err) {
						message.status = "Error saving syllabus to database: " + err;
					} else {
					
						if (doc == 1) {
							message.status = "Successfully updated syllabus in database";
						} else {
							message.status = "Successfully saved syllabus to database (" + doc._id + ")";
							message.syllabus_id = doc._id
						}

					}
				
					response.writeHead(200, {"Content-Type": "application/json"});
					response.write(JSON.stringify(doc));
					response.end(); 
			
					utility.update_status(message.status);
			
				});	// End save syllabus to db
			
			
			}); // End of handling save syllabus put	
			
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
					result.topic_number = data.topic;
										
    				utility.update_status(util.inspect(result, false, null));
    				socket.emit("worldcat_search_results", result);
				});
				
			});
		
		
	});
	});
	
});



// Send syllabi in JSON format to web page
function send_syllabi(request, response) {
 
	var collection = config.db.collection('syllabi').find({},{_id:1, department:1, course_name:1, instructor:1, semester:1,course_description:1},{sort: {'department.name':1, 'department.number':1}}).limit(100)
      .toArray(function(err, docs) {
		
			message = {};
					
			if (err) {
				message.status = "Error reading syllabi from database: " + err;
			} else {
				message.status = "Successfully found " + docs.length + " syllabi in database";
				
				// Sort results
				var sorted_syllabi = _und.sortBy(docs, function(doc) { 
					if ( (typeof doc.department != 'undefined') && (typeof doc.department[0].name != 'undefined')) {
						return doc.department[0].code;
					} else {
						return '';
					}
				});
			}
		
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(JSON.stringify(sorted_syllabi));
			response.end(); 
			
			utility.update_status(message.status);
        
    });
	
}





// Send a specific syllabus in JSON format to web page
function get_syllabus(request, response) {
 
 	var syllabus_id = request.url.match(get_syllabus_req_regex)[1];
 	
 	// If _id is present, convert it to object
 	var id;
	if (typeof syllabus_id !== 'undefined') {
		id = new mongo.ObjectID(syllabus_id)
	}
	utility.update_status("looking for:");
	utility.update_status(id);
	
	var message;
	
	var collection = config.db.collection('syllabi').findOne({_id:id}, function(err, doc) {
				
		if (err) {
		
			utility.update_status("Error reading syllabi from database: " + err);
		
		} else if (doc == null ) {
		
			utility.update_status("Did not find a match for syllabus ID: " + syllabus_id);
		
		} else {
		
			utility.update_status("Successfully found syllabus id " + syllabus_id + " in database");
			send_json_message(response, doc);
		}
		
			

	});
        
}




// Given a message in JSON format and a response, send the message to the web page
function send_json_message(response, message) {

	// Log the message
	console.log(message);

	response.writeHead(200, {"Content-Type": "application/json"});
	response.write(JSON.stringify(message));
	response.end(); 
	
	utility.update_status(message.status_message);
}


