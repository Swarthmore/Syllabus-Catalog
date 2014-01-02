// app.js

var app = app || {};

$(function() {

	console.log(app);

	var syllabus = new app.Syllabus({course_name: "TESTING"});

	app.syllabi_listing = new app.Syllabi();

	new app.SyllabiView( );


	
});
