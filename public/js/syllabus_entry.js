// JS code for Syllabus Entry 




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

	socket = io.connect('http://23.23.177.220', {
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




// READY FUNCTION
	
$(document).ready(function() {
	
	show_syllabus_detail();
	setup_nav_links();
	 
	start_ws();		// Start web sockets	
	
});




function setup_syllabus_detail_template(syllabus) {

	var m = render("syllabus_detail_template", syllabus);
	$("#syllabus_detail_container").html(m);
	
	setup_dept_template(syllabus);
	setup_instructor_template(syllabus);
	setup_week_template(syllabus);

}


function setup_dept_template(syllabus) {

	// Add the department listing structure
	var m = render("department_template", syllabus);
	$(m).appendTo("#departments").slideDown();
	
	// Add an initial department
	var department_list = $("#department_listing > table")
	var m = render("department_entry_template", syllabus);
	$(m).appendTo(department_list).slideDown();
}


function setup_instructor_template(syllabus) {
	var m = render("instructor_template", syllabus);
	$(m).appendTo("#instructors").slideDown();
}



function setup_week_template(syllabus) {
			
	var m = render("week_template", syllabus);
	$(m).appendTo("#weeks").slideDown();	

}


function setup_nav_links() {

	$("#search_button").click(function() {
	
		// Highlight search as active
		$("ul.navbar-nav li").removeClass("active");
		$(this).closest("li").addClass('active');
	
		// Show correct content
		$("#search_container").removeClass('hidden');
		$("#syllabus_detail_container").addClass('hidden');
		
		// Search for syllabi
		search_syllabi();
	});

	$("#entry_button").click(function() {
		show_syllabus_detail();
	});

}




function show_syllabus_detail(syllabus) {

		// If not called with data, make a blank syllabus entry
		if (typeof syllabus != 'object') {
			syllabus = {data:{}};
		}

		console.log("Show syllabus_detail:");
		console.log(syllabus);

		// Fill out template
		setup_syllabus_detail_template(syllabus);

		// Highlight search as active
		$("ul.navbar-nav li").removeClass("active");	
		$(this).closest("li").addClass('active');
	
		$("#search_container").addClass('hidden');
		$("#syllabus_detail_container").removeClass('hidden');

}