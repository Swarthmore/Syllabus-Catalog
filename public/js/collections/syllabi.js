// Define syllabi --> a collection of syllabus models

var app = app || {};

app.Syllabi = Backbone.Collection.extend({ 

	model: app.Syllabus,

	url: '/api/syllabi',
	
	initialize: function(){
		console.log('New Syllabi model created.');
		
		this.on('add', function(syllabus){
            console.log('New Syllabus added to Syllabi collection:');
            console.log(syllabus);
        });
    }, 

	
	events:{
        //'click #save_syllabus':'addSyllabus'
	},
	
	addSyllabus: function( e ) {
		console.log("Saving syllabus");
		var data = prepare_syllabus_data();
		this.model.set(data)
		app.Syllabi.add(this.model, {merge: true });
		//this.model.save();
	}, 

});