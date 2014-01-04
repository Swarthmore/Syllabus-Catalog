// Topic/ week model

var app = app || {};

app.Topic = Backbone.Model.extend({
	defaults: {
		"title" : null,
		"details" : [],
		"dates" : null,
		"readings" : null,
	}
});
