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
	},
	
	initialize: function() {
		console.log('New syllabus model created.');
		
		this.on('change', function(){
            alert('Syllabus model has changed.');
        });
        
        this.on("invalid", function(model, error) {
        	alert(error);
        });
	
	}, // end of initialize
	
	
	validate: function(attribs) { 
		if (attribs.department.length < 1){
			return "Remember to set a department."; 
		}
		if (attribs.instructor.length < 1){
			return "Remember to set an instructor."; 
		}	
	}
	
});
