var fs = require('fs'),
	csv = require('csv'),
	mongo = require('mongodb'),
	iniparser = require('iniparser'),
	async = require('async');



var MongoClient = mongo.MongoClient;
var BSON = mongo.BSONPure;
var CONFIG_FILE = './syllabus.conf';


load_config();


function load_config() {
	async.series([
		function(callback) {
			load_config_file(CONFIG_FILE, callback);
		}, 
		
		function(callback) {
			connect_to_db(config, callback);
		}

	]);
}	



function load_config_file(config_file, callback) {
	iniparser.parse(config_file, function(err,data) {
		config = data;
		console.log("Opened config file");
		callback(err, config);
	});
}



function connect_to_db(config, callback) {

	console.log("Connecting to database");
	MongoClient.connect('mongodb://127.0.0.1:27017/syllabus-catalog', function(err, db) {
		if(err) {console.log("Can't connect to database: " + err);}

		config.db = db;
		callback(err, config);   
	});

}






csv()
.from.path(__dirname+'/data/courses.csv', { delimiter: ',', escape: '"' })
.to.array( function(data){

	data.forEach(function(course) {
		
		var data = {};
		
		var dept = course[0].split(" ");
		data.department = [{code:dept[0], number:dept[1]}];
		
		data.course_name = course[1];
		
		data.course_description = course[2];
			
		var _id = config.db.collection('syllabi').save(data, function(err, doc) {
						
			if (err) {
				console.log("Error saving syllabus to database: " + err);
				
			} else {
		
				if (doc == 1) {
					console.log("Successfully updated syllabus in database");
				} else {
					console.log("Successfully saved syllabus to database (" + doc._id + ")");
				}
			}
			
		}); // End db save
			

		
		console.log(data);
			
			
			
		}); // End loop through courses

}); // End CSV process
