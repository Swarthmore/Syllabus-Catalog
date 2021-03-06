// Syllabi view --> list of Syllabi collection

var app = app || {};


app.SyllabiView = Backbone.View.extend ({

	el: '#page_container',
	
	initialize: function( initialSyllabi ) {
		
		console.log("initialize SyllabiView");

		var self = this;
		this.collection.fetch().complete(function(){
		  self.render();
		});

		//this.listenTo( this.collection, 'add', this.renderBook );
		//this.listenTo( this.collection, 'fetch', this.render ); 
		
	},

	render: function() {
	
		// Highlight search as active
		$("ul.navbar-nav li").removeClass("active");
		$("#search_button").closest("li").addClass('active');
	
		console.log("Rendering syllabi view");	
	
		var t = render("search_results_template");
		this.$el.html(t);
			
		this.collection.each(function(model) { 
			var m = render("syllabus_table_row_template", model.toJSON());			
			this.$("#syllabi_search_table_body").append(m);
		});
				
		return this;
	} ,
	
	
	events: {
		'click .view_syllabus': 'view_syllabus',
		'click .remove_syllabus': 'delete_syllabus'
	},
	
	view_syllabus: function(e) {
		var button = $(e.currentTarget);
		var model_index = $("#syllabi_search_table_body button.view_syllabus").index(button);
		console.log("Clicked on a syllabus:");
		
		if (app.syllabus_detail_view) { app.syllabus_detail_view.remove(); }
		app.syllabus_detail_view = new app.SyllabusView({model:this.collection.models[model_index]});
	},

	delete_syllabus: function(e) {
	
		var button = $(e.currentTarget);
		var model_index = $("#syllabi_search_table_body button.remove_syllabus" ).index(button);
		var self = this;
		console.log(model_index);

  
   		BootstrapDialog.show({
   			title: 'Confirm syllabus deletion',
            message: 'Are you sure you want to delete the syllabus?',
            buttons: [ {label: 'Cancel',
                action: function(dialogRef){
                    dialogRef.close();
                	}
            	},{
            	label: 'Delete Syllabus',
                cssClass: 'btn-danger',
                action: function(dialogRef){
                	delete_a_syllabus(self, model_index)
                    dialogRef.close();
                	}
            	}]
       	 });
  
	}, // End of delete

	
	// Override remove to prevent removal of el	
	// See http://stackoverflow.com/questions/10966440/recreating-a-removed-view-in-backbone-js	
	remove: function() {
		this.undelegateEvents();
		this.$el.empty();
		this.stopListening();
		return this;
	}
	
});



function delete_a_syllabus(view, model_index) {

	view.collection.models[model_index].destroy({
		success: function(model, response) {
			console.log("Destroyed syllabus");
			},
		error: function(model, response) {
			console.log("Error destroying syllabus");
			}
	});
	view.render();    

}

