function setup_segment_buttons() {

	$(".add_segment").off("click");
	console.log("Unbinding click function");
	$(".add_segment").on("click", function() {
		console.log("Add segment button clicked");
		add_new_segment($( this ));
	});	


	$(".delete_segment").off("click");
	$(".delete_segment").on("click", function() {
		// Find the div with class reading_entry that contains this button and remove it
		$(this).closest(".segment_box").slideUp(
			function() {
				$(this).remove();
				renumber_segments();
			}
		);
	});

	
	// Add a new manual reading
	$(".add_manual_reading").off("click");
	$(".add_manual_reading").on("click", function() {

		var reading_list = $(this).closest(".segment_box").find(".reading_list > table");
		var title = $(this).closest(".segment_box").find(".manual_reading_title").val();

		// Make sure reading list div is visible
		$(this).closest(".segment_box").find(".reading_list").show();
	
		var m = render("reading_entry_template", {citation: title, oclc: null, optional:false});
		$(m).appendTo(reading_list).slideDown();
	});


	// Search for a new reading.
	$(".search_worldcat").off("click");
	$(".search_worldcat").on("click", function() {

		// Set the search button to disabled
		//$(this).find("button").button();
	
		var segment_number = $(this).closest(".segment_box").index(".segment_box") + 1;
		var search_q = $(this).closest(".segment_box").find(".library_search_q").val();
		socket.emit("search_oclc", {q:search_q, segment:segment_number});		
	});	
	
	$(".search_crossref").off("click");
	$(".search_crossref").on("click", function() {

		// Set the search button to disabled
		//$(this).find("button").button();
	
		var segment_number = $(this).closest(".segment_box").index(".segment_box") + 1;
		var search_q = $(this).closest(".segment_box").find(".library_search_q").val();
		socket.emit("search_crossref", {q:search_q, segment:segment_number});		
	});		
	

}
	
	
	
// Create a new segment - either from a button press or highlighted selection
function add_new_segment(button_ref, segment_title, highlight_selection) {
	 
	console.log("Adding a new segment"); 
	
	var  segment_title = segment_title || "";	
	var  highlight_selection = highlight_selection || null;	
	var number_of_segments = $("#segments_list .segment_box").length;
	
	// If the segment was added via a button click, find the segment box that contained the button.
	// Otherwise, get the last segment box
	var this_segment;
	if (button_ref) {
		this_segment = button_ref.closest(".segment_box");
	} else {
		this_segment = $("#segments_list .segment_box").last();
	}

	// Add the new segment, then renumber all the segments
	var m = render("segment_template", {segments:[{title:segment_title, highlight:highlight_selection}]});
	if (number_of_segments > 0) {
		$(m).insertAfter(this_segment).slideDown();
	} else {
		$(m).appendTo($("#segments_list"));
	}
	
	renumber_segments();
	setup_segment_buttons();
	$("#save_syllabus").click();	

}





// Create a new reading - either from a button press or highlighted selection
function add_new_reading(button_ref, reading_title, highlight_selection) {

	console.log("Adding a new reading"); 
	
	var reading_title = reading_title || "";	
	var highlight_selection = highlight_selection || null;	
	var number_of_readings = $(this).closest(".segment_box").find(".reading_list > table tr.reading_entry").length;
	
	// If the segment was added via a button click, find the segment box that contained the button.
	// Otherwise, get the last segment box
	var this_segment;
	if (button_ref) {
		this_segment = button_ref.closest(".segment_box");
	} else {
		this_segment = $("#segments_container .segment_box").last();
	}

	// Add the new segment, then renumber all the segments
	var m = render("segment_template", {segments:[{title:segment_title, highlight:highlight_selection}]});
	if (number_of_segments > 0) {
		$(m).insertAfter(this_segment).slideDown();
	} else {
		$(m).appendTo($("#segments_container"));
	}
	
	renumber_segments();
	setup_segment_buttons();

	var reading_list = $(this).closest(".segment_box").find(".reading_list > table");
	var title = $(this).closest(".segment_box").find(".manual_reading_title").val();

	// Make sure reading list div is visible
	$(this).closest(".segment_box").find(".reading_list").show();

	var m = render("reading_entry_template", {citation: title, oclc: null, optional:false});
	$(m).appendTo(reading_list).slideDown();

}
	
	
	
	

function renumber_segments() {
	// Find all segments and put the correct number in the segment heading
	$(".segment_box").each(function(index, element) {
		$(element).find(".segment_heading").html("Segment " + (index + 1));
	});

	$("#segments_list").sortable({
		placeholder: "sortable_placeholder",
		update: function( event, ui ) {
			renumber_segments() ;
		}
	});
	
}



	
function show_non_empty_reading_lists() {
	// Go through all the segments, and show reading lists with content
	$(".segment_box").each(function(index, element) {
		var rl = $(element).find(".reading_list");
		if (rl.find("tbody tr").length > 0) {
			console.log("reading list with content");
			rl.show();
		}
	});	
}





function initialize_segment_boxes() {
 	// Run renumber
	renumber_segments();
	
	show_non_empty_reading_lists();
	
	setup_segment_buttons();
}