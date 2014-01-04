// Syllabus detail view --> a detailed entry of a syllabus

var app = app || {};


app.SyllabusView = Backbone.View.extend ({

	el: '#page_container', 

	initialize: function() {
	
		console.log("Initialize SyllabusView");

		this.listenTo( this.model, 'sync', function(m) {console.log("Model sync"); this.render;} );
		this.render();
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

		var w = render("week_template", this.model.toJSON());
		$(w).appendTo("#weeks_container").slideDown();	
	
		return this;
		
	} ,

	events:{
        'click #save_syllabus':'saveSyllabus',
        'change input':'saveSyllabus',
        'change select':'saveSyllabus',
	},	
	
	
	saveSyllabus: function(e) {
		var data = prepare_syllabus_data();
		this.model.set(data, {validate: true});
		this.model.save();
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

	// Class website
	syllabus.class_website = $("#class_website").val();	
	
	// Prerequisites
	syllabus.prerequisites = $("#prerequisites").val();	
	
	// Course description
	syllabus.course_description = $("#course_description").val();	
	
	// Assignments
	syllabus.assignments = $("#assignments").val();	
	
	// Policies
	syllabus.policies = $("#policies").val();	
	
	// Class format
	syllabus.class_format = $("#class_format").val();	
	
	// Visitors
	syllabus.visitors = $("#visitors").val();
		
	// Required events
	syllabus.required_events = $("#required_events").val();	
		
	// Readings
	syllabus.readings = get_course_readings();	
		
	// Week information
	syllabus.weeks = get_weeks();	
	
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
		var week = $(this).closest(".week_box").index(".week_box") + 1;
		
		readings.push({ 
			citation: $.trim(citation), 
			pages: $.trim(pages), 
			week: week, 
			oclc_number: $.trim(oclc)
			});
	
	});

	return readings;
}



// get the details for all the weeks in the course
function get_weeks() {

	var weeks = [];

	$(".week_box").each( function(index) {
		var week_number = $(this).index(".week_box") + 1;
		var topic = $(this).find(".week_topic").val();
		var details = $(this).find(".week_details").val();
		
		weeks.push({
			week_number: week_number,
			topic: topic,
			details: details
		});		
	});
	
	return weeks;
}
