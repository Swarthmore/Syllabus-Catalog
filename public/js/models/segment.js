// Segment/ week model

var app = app || {};

app.Segment = Backbone.Model.extend({
	defaults: {
		"title" : null,
		"details" : [],
		"dates" : null,
		"readings" : null,
	}
});
