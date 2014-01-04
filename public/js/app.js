// app.js

var app = app || {};

$(function() {

	setup_nav_links();
	 
	start_ws();		// Start web sockets	
	
	show_project_info(); // Home page

	app.syllabi_listing = new app.Syllabi();
	
});




function setup_nav_links() {

	$("#search_button").click(function() {
	
		// Remove old view
		if (app.syllabi_listview) { app.syllabi_listview.remove(); }
		app.syllabi_listview = new app.SyllabiView({collection:app.syllabi_listing});
	});

	$("#entry_button").click(function() {

		//app.s = new app.Syllabus()
		//app.syllabi_listing.add(s);
		if (app.syllabus_detail_view) { app.syllabus_detail_view.remove(); }
		app.syllabus_detail_view = new app.SyllabusView({model: new app.Syllabus()});
	});
	
	$("#about_button").click(function() {
		show_project_info();
	});	
	
}



// Show "about project" page
function show_project_info() {

	var m = render("about_project_template");
	$("#page_container").html(m).slideDown();	

	// Highlight about as active in top menu
	$("ul.navbar-nav li").removeClass("active");	
	$("#about_button").closest("li").addClass('active');
}








// Set up template rendering function.  This will load templates the first time they are
// used and then cache them.  

function render(tmpl_name, tmpl_data) {
	if ( !render.tmpl_cache ) { 
		render.tmpl_cache = {};
	}

	if ( ! render.tmpl_cache[tmpl_name] ) {
		var tmpl_dir = './template';
		var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

		var tmpl_string;
		$.ajax({
			url: tmpl_url,
			method: 'GET',
			async: false,
			success: function(data) {
				tmpl_string = data;
			}
		});

		render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
	}

	return render.tmpl_cache[tmpl_name](tmpl_data);
}





// Web sockets

function start_ws() {

	socket = io.connect('', {
		'reconnect': true,
		'reconnection delay': 500,
		'max reconnection attempts': Infinity
	});
	var socketTimer;
	var ws_heartbeat_interval = 60000;		// Websocket heartbeat (to keep connection open)
			


	// SOCKET MESSAGE DEFINITIONS 

	socket.on('worldcat_search_results', function(data) {
		console.debug(data);
		var m = render("reading_search_results_template", data);
		$("#reading_search_results_modal").html(m);
		$('#reading_search_results_modal').modal({show:true});
	});


	// When socket is opened, display message in console
	socket.on('connect', function() { 
		
		formatted_time = dateFormat(new Date(), 'mm/dd/yyyy hh:MM TT');
		console.log("Started connection to server: " + formatted_time);
			
		// Turn off automatic attempts to start socket
		clearInterval(socketTimer);
	
		// Replace with heartbeat 
		socketTimer = setInterval(function() {socket.send('heartbeat');}, ws_heartbeat_interval);
				
	}); // End of socket open routine 	




	// If socket is closed, display notification message
	socket.on('disconnect', function() {  
	
		var formatted_time = dateFormat(new Date(), 'mm/dd/yyyy hh:MM TT');
		console.log("Connection with server interrupted: " + formatted_time);
		
		// Turn off automatic attempts to send heartbeat
		clearInterval(socketTimer);		
	
		// Keep trying to restart connection
		socketTimer = setInterval(function(){start_ws()}, 5000);
	});  // End of socket close	




	// If there is a socket error, display a notification message
	socket.on("error", function() {  
		var formatted_time = dateFormat(new Date(), 'mm/dd/yyyy hh:MM TT');
		console.log("Websocket error: " + formatted_time);
	
	}); // End of socket on error	

}

