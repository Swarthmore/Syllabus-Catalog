// Define topics --> a collection of topic models

var app = app || {};

app.Topics = Backbone.Collection.extend({ 
	model: app.Topic,
});
