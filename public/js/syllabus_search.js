// Search for syllabi from the database


// Search for syllabi
function search_syllabi() {

	$.ajax({
		url: '/search_syllabi', 
		type: 'GET'
	})
	.done(function(data) {

		console.log(data);
		
		if (typeof data.data == 'undefined') {
			$("#page_container").html("No syllabi found");
		} else {
			var m = render("search_results_template", data);
			$("#page_container").html(m);
		}
		
	})
	.fail(function() {
		alert("Could NOT retrive syllabi from database!");
	});	

}




// Load a specific syllabus from the database
function load_syllabus(syllabus_id) {

	$.ajax({
		url: '/get_syllabus', 
		type: 'GET',
		data: {syllabus_id: syllabus_id}
	})
	.done(function(response) {

		console.log(response);
		
		if (typeof response.status == 'undefined' || !response.status) {
			alert("Could not find syllabus");
			return;
		} else {
			show_syllabus_detail(response);
		}
		
	})
	.fail(function() {
		alert("Could NOT retrive syllabus \"" + syllabus_id + "\" from database!");
	});	


}



