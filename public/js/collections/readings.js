// Define readings --> a collection of reading models

var app = app || {};

app.Readings = Backbone.Collection.extend({ 
	model: app.Reading,
});