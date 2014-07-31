var http = require("http"),
	utility = require("./utility");



// Do a search of the WordCAT OCLC library and return the results with a socket.
var search_oclc = function(config, search_request, socket) {

	utility.update_status("Search OCLC for: " + search_request.q);
	
	
	http.get("http://www.worldcat.org/webservices/catalog/search/opensearch?q=" + search_request.q + "&format=atom&cformat=mla&count=" + config.OCLC.search_results_count +  "&wskey=" + config.OCLC.wskey, function(res) {

		var pageData = "";

		res.on('error', function(e) {
			utility.update_status("Error doing WorldCat search: " + e.message);
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
				
				// Add segment number to result
				result.segment_number = search_request.segment;
									
				utility.update_status(util.inspect(result, false, null));
				socket.emit("worldcat_search_results", result);
			});
			
		});
	});
}





// Do a search of the CrossRef metadata search and return the results with a socket (http://search.crossref.org/help/api)


var search_crossref = function(config, search_request, socket) {

	utility.update_status("Search CrossRef for: " + search_request.q);
	
	http.get("http://search.crossref.org/dois?q=" + search_request.q + "&sort=score&header=true", function(res) {

		var pageData = "";

		res.on('error', function(e) {
			utility.update_status("Error doing CrossRef search: " + e.message);
		});


		res.on('data', function (chunk) {
			pageData += chunk;
		});


		res.on('end', function(){
			utility.update_status("Got response from CrossRef search: " + res.statusCode);
			
			result = {
					segment_number: search_request.segment,		// Add segment number to result
					data: pageData								// Raw JSON data from query
			}
				
								
			utility.update_status(util.inspect(result, false, null));
			socket.emit("crossref_search_results", result);
			
		});
	});
}




exports.search_oclc = search_oclc;
exports.search_crossref = search_crossref;