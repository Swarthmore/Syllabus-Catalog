

// Define readings detail view --> a detailed listing of a reading
ReadingView = Backbone.View.extend ({

	initialize: function() { 
		this.render();
	},
	
	render: function() {
		var thisModel = this.model.toJSON();
		var t = render("reading_template", thisModel);
		$(this.el).html(t);
	} 
});


// Define topics detail view --> a detailed listing of a topic
TopicView = Backbone.View.extend ({

	initialize: function() { 
		this.render();
	},
	
	render: function() {
		var thisModel = this.model.toJSON();	
		var t = render("topic_template", thisModel);
		$(this.el).html(t);		
	} 
});






var MyRouter = Backbone.Router.extend({ routes: {
    "/syllabus/:id": "getSyllabus",
    "/syllabus/new": "newSyllabus",
  },
	newSyllabus: function( syllabus ) {
		new SyllabusView({ el: $("#page_container"), model:  new syllabus({ course_name: 'Fred', class_website: 'http://google.com'})});
	} 
});

var router = new MyRouter; 

Backbone.history.start();



$(document).ready(function() {


var s = new syllabus({ course_name: 'Larry', class_website: 'http://google.com'});
//	var s  = {data:{ course_name: 'Larry', class_website: 'http://google.com'}};


//var syllabus_detail_view = new SyllabusView({ el: $("#page_container"), model: s});

});