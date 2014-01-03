// Syllabus detail view --> a detailed entry of a syllabus

var app = app || {};


app.SyllabusView = Backbone.View.extend ({

	el: '#page_container',

	events:{
        'click #save_syllabus':'saveSyllabus'
	},

	initialize: function( initialSyllabus ) {
		this.model = new app.Syllabus( initialSyllabus ); 
		this.render();
		console.log("initialize SyllabusView");
		 
	},
		
	render: function() {
		console.log("Rendering syllabus");
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
	
	
	initialize: function(m) {
		this.model = m;
		this.render();
	},
	
	saveSyllabus: function(e) {
		var data = prepare_syllabus_data();
		this.model.set(data);
		this.model.save();
	}
	
});



function save_syllabus() {
	console.log("Saving syllabus");
	var data = prepare_syllabus_data();
	
	var s = app.syllabi_listing.save( data );
	new app.SyllabusView( s );
}




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


