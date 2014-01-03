// Syllabi view --> list of Syllabi collection

var app = app || {};


app.SyllabiView = Backbone.View.extend ({

	el: '#page_container',
	
	initialize: function( initialSyllabi ) {
		console.log("initialize SyllabiView");
		console.log(this.collection);
			
		
		var self = this;
		this.collection.fetch().complete(function(){
		  self.render();
		});

		//this.listenTo( this.collection, 'add', this.renderBook );
		//this.listenTo( this.collection, 'fetch', this.render ); 
		
	},

	render: function() {
		console.log("Rendering syllabi view");	
	
		var t = render("search_results_template");
		this.$el.html(t);
			
		this.collection.each(function(model){ 
			var m = render("syllabus_table_row_template", model.toJSON());			
			this.$("#syllabi_search_table_body").append(m);
		});
				
		return this;
	} ,
	
	
	events: {
	
		'click .view_syllabus': 'view_syllabus'
	
	},
	
	view_syllabus: function(e) {
		var button = $(e.currentTarget);
		var model_index = $("#syllabi_search_table_body button").index(button);
		var v = new app.SyllabusView(this.collection.models[model_index ]);
	}
	
});



