// Code for highlighting syllabi 

// Constants
var PATH_TO_CSS = "/css/highlighting.css" // for highlighting CSS details
var SYLLABUS_IFRAME = $("#syllabus_iframe" ).get(0);

var highlighter;
var segments = [];

console.log("Highlighter loaded");


	
      
    
            
// Based on keypress, take appropriate action
function handle_keypress(event) {

	console.log("Received keypress with code: " + event.which);
	
	// If ctrl, command, or alt are pressed, exit
	// See http://www.epigroove.com/blog/check-for-modifier-keys-when-using-jquerys-keypress
	if (event.altKey || event.ctrlKey || event.metaKey) { return;}
	
	
	switch(event.which) {

		case 83:  // S
		case 115: // s
			highlightSelectedText("highlight_segment");
			break;
		case 50: // 2
			highlightSelectedText( "highlight_reading" );
			break;
		case 65:  // A
		case 97:  // a
			highlightSelectedText( "highlight_assignment" );
			break;
		case 77:  // M
		case 109: // m
			highlightSelectedText( "highlight_meetingtimes" );
			break;
		case 72:  // H
		case 104: // h
			highlightSelectedText( "highlight_officehours" );
			break;
		case 79:  // O
		case 111: // o
			highlightSelectedText( "highlight_outcomes" );
			break;
		case 87:  // W
		case 119: // w
			highlightSelectedText( "highlight_classwebsite" );
			break;	
		case 68:  // D
		case 100: // d
			highlightSelectedText( "highlight_description" );
			break;
		case 80: // P
		case 112: // p
			highlightSelectedText( "highlight_policies" );
			break;	
		case 78:  // N		
		case 110: // n
			highlightSelectedText( "highlight_notes" );
			break;		
		case 67:  	// C		
		case 99: 	// c
			highlightSelectedText( "highlight_coursename" );
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

	console.log("Setting up keypress events for highlighting");
	$( SYLLABUS_IFRAME.contentWindow.document).keyup(function(event) {
		handle_keypress(event)
	});

	
	// Set up highlighter
	highlighter = rangy.createHighlighter(SYLLABUS_IFRAME.contentWindow.document);

	// Configure classes to apply for highlighting
	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_segment", {
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

	highlighter.addClassApplier(rangy.createCssClassApplier("highlight_coursename", {
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
		
		case "highlight_segment":
			add_new_segment(null, sel.toString(), highlighter.serialize(sel));	// Create a new segment with the highlighted text
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

		case "highlight_coursename":
			add_text_to_element("coursename", sel.toString(), highlighter.serialize(sel));		
			break;						
											
		}
	
}



function collect_highlights() {
	if (!_.isUndefined(highlighter)) {
		return highlighter.serialize();
	} else {
		return null;
	}
}



// Given a serialized highlight selection, highlight the appropriate location in the syllabus
function highlight_syllabus_segments(serialized_highlight) {
	if (!_.isUndefined(serialized_highlight) && serialized_highlight != "" && serialized_highlight != null) {
		console.log("Highlighting text: " + serialized_highlight);
		highlighter.deserialize(serialized_highlight);
		
	} else {
		console.log("No highlighting found");
	}
}
        
        

// Remove the highlight from the syllabus and also remove any matching segments
function removeHighlightFromSelectedText() {
	// Get selection from iframe   
	var sel = rangy.getSelection(SYLLABUS_IFRAME);

	highlighter.unhighlightSelection(sel);
}


function remove_all_highlights() {
	highlighter.removeAllHighlights();
}
