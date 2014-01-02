// Syllabus model


var app = app || {};

app.Syllabus = Backbone.Model.extend({

	idAttribute: "_id", 
	
	defaults: {
		"department" : [],
		"course_name" : " ",
		"instructor" : [],
		"semester" : null,
		"credits" : null,
		"class_website" : null,
		"prerequisites" : null,
		"course_description" : null,
		"assignments" : null,
		"policies" : null,
		"class_format" : null,
		"visitors" : null,
		"required_events" : null,
		"readings" : [],
		"topics" : null,
		"non_associated_readings": []
		
	}
	
});
