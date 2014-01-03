var TodoView = Backbone.View.extend({ 

	el: "#syllabi_search_table_body",

	tagName: 'tr',
	
	// Cache the template function for a single item.
	todoTpl: _.template( render("syllabus_table_row_template" ),
	
	events: {
        'click .view_syllabus': 'view',
        'keypress .edit': 'updateOnEnter',
        'blur .edit':   'close'
	},
	
	// Re-render the titles of the todo item.
	render: function() {
		var t = render("syllabus_table_row_template", this.model.toJSON() );
		this.$el.html(t); 
￼		return this; 
	},


	view: function() {
		// Requested a detailed view of the syllabus
	},

	close: function() {
        // executed when todo loses focus
	},
	
	updateOnEnter: function( e ) {
		// executed on each keypress when in todo edit mode, // but we'll wait for enter to get in action
	}
	
});