// Take syllabus information and prepare to send to database

function parse_syllabus_data() {

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



// Send syllabus to database
function search_syllabi() {

	var syllabus = prepare_syllabus_data();

	$.ajax({
		url: '/save_syllabus', 
		type: 'POST', 
		contentType: 'application/json', 
		data: JSON.stringify(syllabus)
	})
	.done(function(data) {
		alert(data.status);
		console.log(data);
		
		// Set the syllabus_id (if provided)	
		if (typeof data.syllabus_id !== 'undefined') {
			$("#syllabus_id").val(data.syllabus_id);
		}
	})
	.fail(function() {
		alert("Could NOT save syllabus to database!");
	});	

}





