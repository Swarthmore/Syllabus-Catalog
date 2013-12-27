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




// READY FUNCTION
	
$(document).ready(function() {
	
	setup_nav_links();
	 
	start_ws();		// Start web sockets	
	
	show_project_info(); // Home page
	
});



// Configuration form validation
function setup_form_validation() {

 $('#syllabus_detail_form').validate({ // initialize the plugin
 
		errorClass:'has-error',
		validClass:'has-success',
		errorElement:'span',
		highlight: function (element, errorClass, validClass) { 
			$(element).parent().addClass(errorClass).removeClass(validClass); 
		}, 
		unhighlight: function (element, errorClass, validClass) { 
			$(element).parent(".has-error").removeClass(errorClass).addClass(validClass); 
		},
 
 
        rules: {
            semester_selection: {
                select_option: true
            },
            class_website: {
            	url:true,
            	//required: true
            }
            
        },
        
        messages: {
    		semester_selection: "Please specify the semester"
    		},
    		
    	invalidHandler: function(event, validator) {
			// 'this' refers to the form
			var errors = validator.numberOfInvalids();
			if (errors) {
				var message = errors == 1
				? 'You missed 1 field. It has been highlighted'
				: 'You missed ' + errors + ' fields. They have been highlighted';
				alert(message);
			}
		}
        
    });


	// Method for making sure an option is selected from a select box
    $.validator.addMethod('select_option', function (value) {
        return (value != '-1' && value != null);
    }, "Select a value");	
    
    $.validator.addMethod("text_entry_required", function(value) {
    	return (value != "" && value != null);
    }, "Entry required");
    
    // Add validation rules to other classes
	$.validator.addClassRules("department_selection", { select_option: true });
	$.validator.addClassRules("course_number_entry", { text_entry_required: true, message: "Course number required"});
}



function setup_syllabus_detail_template(syllabus) {
	
	var m = render("syllabus_detail_template", syllabus);
	$("#page_container").html(m);
	
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
		
		// Search for syllabi
		search_syllabi();
	});

	$("#entry_button").click(function() {
		show_syllabus_detail();
	});
	
	$("#about_button").click(function() {
		show_project_info();
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

		// Setup form validation for syllabus entry
		setup_form_validation();

		// Highlight search as active in top menu
		$("ul.navbar-nav li").removeClass("active");	
		$("#entry_button").closest("li").addClass('active');

}



// Show "about project" page
function show_project_info() {

	var m = render("about_project_template");
	console.log(m);
	$("#page_container").html(m).slideDown();	

	// Highlight about as active in top menu
	$("ul.navbar-nav li").removeClass("active");	
	$("#about_button").closest("li").addClass('active');
}
