// Syllabi view --> list of Syllabi collection

var app = app || {};


app.SyllabiView = Backbone.View.extend ({

	el: '#page_container',
	
	initialize: function( initialSyllabi ) {
		this.collection = new app.Syllabi( initialSyllabi ); 
		this.collection.fetch({reset: true});
		this.render();
		console.log("initialize SyllabiView");
		
		//this.listenTo( this.collection, 'add', this.renderBook );
		this.listenTo( this.collection, 'reset', this.render ); 
	},

	render: function() {
		console.log("Rendering syllabi view");
		console.log(this.collection.toJSON());
		var t = render("search_results_template", this.collection.toJSON());
		console.log(this.$el);
		this.$el.html(t);
		return this;
	} 
	
});



