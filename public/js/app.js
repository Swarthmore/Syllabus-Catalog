// app.js

var app = app || {};

$(function() {

	console.log(app);

	app.syllabi_listing = new app.Syllabi();
	//app.syllabi_listing.fetch();

	app.syllabi_listview = new app.SyllabiView({collection:app.syllabi_listing});
	
});
