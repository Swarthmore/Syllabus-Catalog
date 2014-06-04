// Syllabus detail view --> a detailed entry of a syllabus

var app = app || {};


app.SyllabusView = Backbone.View.extend ({

	el: '#page_container', 

	initialize: function() {
	
		console.log("Initialize SyllabusView");
		
		// If this is an existing model, get the full data set
		var view = this;
		if (typeof this.model.get("_id") != 'undefined') {
			console.log("Fetching syllabus model data");
			this.model.fetch({
				success: function(model, response, options) {
					view.render();
				}
			
			});
		} else {
			view.render();
		}

		this.listenTo( this.model, 'sync', function(m) {console.log("Model sync"); this.render;} );
		
	},
		
	render: function() {
	
		console.log("Rendering syllabus");
		// Highlight "Add Syllabus" as active in top menu
		$("ul.navbar-nav li").removeClass("active");	
		$("#entry_button").closest("li").addClass('active');
	
		var t = render("syllabus_detail_template", this.model.toJSON());
		this.$el.html(t);
		
		// Add the department listing structure
		var d = render("department_entry_template", this.model.toJSON());
		$(d).appendTo("#departments table tbody").slideDown();
		
		var i = render("instructor_template", this.model.toJSON());
		$(i).appendTo("#instructors").slideDown();

		var w = render("topic_template", this.model.toJSON());
		$(w).appendTo("#topics_container").slideDown(function() {
			initialize_topic_boxes();	// Set up numbering and button options	
		});	
		
	
		var w = render("assignment_template", this.model.toJSON());
		$(w).appendTo("#assignments_container").slideDown();	

		var i = render("syllabus_upload_template", this.model.toJSON());
		$(i).appendTo("#load_syllabus").slideDown();


		return this;
		
	} ,

	events:{
        'click #save_syllabus':'saveSyllabus',
        'change input':'saveSyllabus',
        'change select':'saveSyllabus',
        'change textarea':'saveSyllabus'
	},	
	
	
	saveSyllabus: function(e) {
		$("#save_icon").removeClass("hidden glyphicon-floppy-remove").addClass("glyphicon-floppy");
		var data = prepare_syllabus_data();
		// Need an initial parameter (see http://stackoverflow.com/questions/11322182/backbone-model-save-not-calling-either-error-or-success-callbacks)
		this.model.set(data);
		this.model.save(null, {
			success: function(model, response, options) {
				console.log("Model Saved");
				$("#syllabus_id").val(model.get("_id"));	// Update model id
				window.setTimeout(function() {$("#save_icon").addClass("hidden");}, 1000);	// Hide "save" icon after a delay
				
			},
			error: function (model, response) {
				console.log("Model save error");
				$("#save_icon").removeClass("hidden glyphicon-floppy").addClass("glyphicon-floppy-remove");
			}
		});
	},
	

	// Override remove to prevent removal of el	
	// See http://stackoverflow.com/questions/10966440/recreating-a-removed-view-in-backbone-js
	remove: function() {
		this.undelegateEvents();
		this.$el.empty();
		this.stopListening();
		return this;
	}
	
});





// Take syllabus information and prepare to send to database
function prepare_syllabus_data() {

	var syllabus = {};
	
	// Departments
	syllabus.department = get_departments();
	
	// Course name
	syllabus.course_name = $("#coursename").val();
	
	// Instructors
	syllabus.instructor = get_instructors();
	
	// Semester
	syllabus.semester = $("#semester_selection").val();

	// Credits
	syllabus.credits = $("#credit_selection").val();	

	// Meeting Times
	syllabus.meeting_schedule = $("#meeting_schedule").val();	

	// Office Hours
	syllabus.office_hours = $("#office_hours").val();	

	// Rights
	syllabus.rights = $("#rights").val();	

	// Other notes
	syllabus.notes = $("#notes").val();	

	// Outcomes
	syllabus.outcomes = $("#outcomes").val();	

	// Class website
	syllabus.class_website = $("#class_website").val();	
	
	// Prerequisites
	syllabus.prerequisites = $("#prerequisites").val();	
	
	// Course description
	syllabus.course_description = $("#course_description").val();	

	// Assessment
	syllabus.assessment = $("#assessment").val();	
	
	// Assignments
	syllabus.assignments = $("#assignments").val();	
	
	// Policies
	syllabus.policies = $("#policies").val();	
	
	// Class format
	syllabus.class_format = $("#format_selection").val();	
	
	// Visitors
	syllabus.visitors = $("#visitors").val();
		
	// Required events
	syllabus.required_events = $("#required_events").val();	
		
	// Readings
	syllabus.readings = get_course_readings();	
		
	// Topic information
	syllabus.topics = get_topics();	
		
	// Assignment information
	syllabus.assignments = get_assignments();	

	// Syllabus status 
	syllabus.status = $("#syllabus_status").val();	

	// Syllabus status 
	syllabus.syllabus_html = $("#syllabus_iframe").contents().find("html").html();

	// Syllabus ID -- only include if the ID has been already set
	// the ID is set when saving to the db
	if ($("#syllabus_id").val() != "") {
		syllabus._id = $("#syllabus_id").val();
	}	
		
		
	return syllabus;

}



function get_departments() {

	// Departments
	var department = []
	
	// Get a list of all the department entries
	$(".department_entry").each( function(index) {
		
		var dept_name = $(this).find(".department_selection").val();
		var course_number = $(this).find(".course_number_entry").val();
	
		department.push({ name: dept_name, number: course_number});
	
	});

	return department;
}





function get_instructors() {

	// Departments
	var instructor = [];
	
	// Get a list of all the department entries
	$(".instructor_entry .instructor_name").each( function(index) {
		
		instructor.push($(this).val());
	
	});

	return instructor;
}



// get all the readings in the course
function get_course_readings() {

	var readings = [];
	
	// Get a list of all the readings in the course
	$(".reading_entry").each( function(index) {
		
		var citation = $(this).find(".reading_citation_cell").text();
		var pages = $(this).find(".pages").val();
		var oclc = $(this).find(".oclc_number_cell").html();
		var optional = $(this).find(".optional").prop('checked');
		var topic = $(this).closest(".topic_box").index(".topic_box") + 1;
		
		readings.push({ 
			citation: $.trim(citation), 
			pages: $.trim(pages), 
			topic: topic, 
			oclc_number: $.trim(oclc),
			optional: optional
			});
	
	});

	return readings;
}



// get the details for all the topics in the course
function get_topics() {

	var topics = [];

	$(".topic_box").each( function(index) {
		var topic_number = $(this).index(".topic_box") + 1;
		var title = $(this).find(".topic_title").val();
		var details = $(this).find(".topic_details").val();
		var highlight = $(this).find(".topic_highlight").val();
		
		topics.push({
			topic_number: topic_number,
			title: title,
			details: details,
			highlight: highlight
		});		
	});
	
	return topics;
}


// get the details for all the assignments in the course
function get_assignments() {

	var assignments = [];

	$(".assignment_box").each( function(index) {
		var assignment_number = $(this).index(".assignment_box") + 1;
		var title = $(this).find(".assignment_title").val();
		var description = $(this).find(".assignment_description").val();
		var duedate = moment($(this).find(".assignment_duedate").val()).toDate(); 	// Use moment to parse due date and convert to JS date for MongoDB
		
		assignments.push({
			assignment_number: assignment_number,
			title: title,
			description: description,
			duedate: duedate
		});		
	});
	
	return assignments;
}

