// Reading model

var app = app || {};

app.Reading = Backbone.Model.extend({
	defaults: {
		"author" : null,
		"link" : [],
		"description" : null,
		"guid" : null,
		"dc:identifier" : [],
		"oclcterms:recordIdentifier" : null,
		"bibliographic_record": null
	}
});