// Define syllabi --> a collection of syllabus models

var app = app || {};

app.Syllabi = Backbone.Collection.extend({ 
	model: app.Syllabus,
	url: '/api/syllabi'
});