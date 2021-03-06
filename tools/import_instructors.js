var fs = require('fs'),
	csv = require('csv'),
	mongo = require('mongodb'),
	iniparser = require('iniparser'),
	async = require('async');



var MongoClient = mongo.MongoClient;
var BSON = mongo.BSONPure;
var CONFIG_FILE = '../syllabus.conf';
var config;

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
			load_instructors(config, callback);
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
	MongoClient.connect("mongodb://" + config.DB.db_host + ":27017/" + config.DB.db_name, function(err, db) {
		if(err) {console.log("Can't connect to database: " + err);}

		config.db = db;
		callback(err, config);   
	});

}




function load_instructors(config, callback) {

	csv()
	.from.path(__dirname+'/../data/instructors.csv', { delimiter: ',', escape: '"' })
	.to.array( function(data){

		var err;

		data.forEach(function(instructor) {
		
			var data = {};
		
			data.fullname = instructor[0];
			data.username = instructor[1];
			data.department = instructor[2];
			data.email = instructor[3];
			data.last_name = instructor[4]; 
		
			var _id = config.db.collection('instructors').save(data, function(err, doc) {
						
				if (err) {
					console.log("Error saving instructor to database: " + err);
				
				} else {
		
					if (doc == 1) {
						console.log("Successfully updated instructor in database");
					} else {
						console.log("Successfully saved instructor to database (" + doc._id + ")");
					}
				}
			
			}); // End db save
			
			console.log(data);
			
		}); // End loop through instructors
	
		callback(err, config);
		process.exit(1);	  

	}); // End CSV process

} // End load_instructors

