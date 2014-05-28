// Code for highlighting syllabi 

// Constants
var PATH_TO_CSS = "/css/highlighting.css" // for highlighting CSS details
var SYLLABUS_IFRAME = $("#syllabus_iframe" ).get(0);

var highlighter;
var topics = [];

console.log("Highlighter loaded");

// When script is loaded, check for iframe to load and then set up keypress functions and rangy object
$("#syllabus_iframe" ).load(function() {
	console.log("Setting up iFrame keypress");
	
	$( SYLLABUS_IFRAME.contentWindow.document).keyup(function(event) {
		handle_keypress(event)
	});
	
	setup_rangy();	
});
	
      
            

            
// Based on keypress, take appropriate action
function handle_keypress(event) {

	console.log("Received keypress with code: " + event.which);
	switch(event.which) {

		case 49: // 1
			highlightSelectedText("highlight_topic");
			break;
		case 50: // 2
			highlightSelectedText( "highlight_reading" );
			break;
		case 51: // 3
			highlightSelectedText( "highlight_assignment" );
			break;
		case 52: // 4
			highlightSelectedText( "highlight_meetingtimes" );
			break;
		case 53: // 5
			highlightSelectedText( "highlight_officehours" );
			break;
		case 54: // 6
			highlightSelectedText( "highlight_outcomes" );
			break;
		case 55: // 7
			highlightSelectedText( "highlight_classwebsite" );
			break;	
		case 56: // 8
			highlightSelectedText( "highlight_description" );
			break;
		case 57: // 9
			highlightSelectedText( "highlight_policies" );
			break;			
		case 48: // 0
			highlightSelectedText( "highlight_notes" );
			break;										
		case 82: // R
		case 114: // r
			removeHighlightFromSelectedText();
			break;    			
	}
	
}




function setup_rangy() {

	console.log("Setting up rangy");
	rangy.init();
	
	// Set up highlighter
	highlighter = rangy.createHighlighter(SYLLABUS_IFRAME.contentWindow.document);

	// Configure classes to apply for highlighting
	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_topic", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));

	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_reading", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));            

	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_assignment", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  

	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_meetingtimes", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  

	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_officehours", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  
	
	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_outcomes", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  
	
	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_classwebsite", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  
	
	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_description", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  	

	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_policies", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  	
	
	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_notes", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  			

	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_description", {
		ignoreWhiteSpace: true,
		tagNames: ["span", "a"]
	}));  		
	
	
	
	// Add highlighting styles to the iframe
	var head = $("#syllabus_iframe" ).contents().find("head");                
	head.append($("<link/>", { rel: "stylesheet", href: PATH_TO_CSS, type: "text/css" }));
	
}




function highlightSelectedText(highlight_mode) {

	// Get selection from iframe   
	var sel = rangy.getSelection(SYLLABUS_IFRAME);
				
	// Create a highlight from the selection
	console.log(sel.toString());
	highlighter.highlightSelection(highlight_mode, sel);  
	
	// Based on the the highlight mode, take the appropriate action
	switch (highlight_mode) {
		
		case "highlight_topic":
			add_new_topic(null, sel.toString(), highlighter.serialize(sel));	// Create a new topic with the highlighted text
			break;
			
		case "highlight_reading":
			add_new_reading(null, sel.toString(), highlighter.serialize(sel));	// Create a new reading with the highlighted text	
			break;

		case "highlight_meetingtimes":
			add_text_to_element("meeting_schedule", sel.toString(), highlighter.serialize(sel));		
			break;	
			
		case "highlight_officehours":
			add_text_to_element("office_hours", sel.toString(), highlighter.serialize(sel));		
			break;	
			
		case "highlight_outcomes":
			add_text_to_element("outcomes", sel.toString(), highlighter.serialize(sel));		
			break;			
			
		case "highlight_classwebsite":
			add_text_to_element("class_website", sel.toString(), highlighter.serialize(sel));		
			break;
			
		case "highlight_description":
			add_text_to_element("course_description", sel.toString(), highlighter.serialize(sel));		
			break;				
			
		case "highlight_policies":
			add_text_to_element("policies", sel.toString(), highlighter.serialize(sel));		
			break;				
		
		case "highlight_notes":
			add_text_to_element("notes", sel.toString(), highlighter.serialize(sel));		
			break;				
					
											
		}
	
}



// Given a serialized highlight selection, highlight the appropriate location in the syllabus
function highlight_syllabus_topics(serialized_highlight) {
	// Make sure syllabus is loaded
	$("#syllabus_iframe" ).load(function() {
		highlighter.deserialize(serialized_highlight);
		console.log("Highlighting text");
	});

}
        
        

// Remove the highlight from the syllabus and also remove any matching topics
function removeHighlightFromSelectedText() {
	// Get selection from iframe   
	var sel = rangy.getSelection(SYLLABUS_IFRAME);

	highlighter.unhighlightSelection(sel);
}



