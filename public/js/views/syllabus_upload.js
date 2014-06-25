var url = '/upload';

$('#fileupload').fileupload({
    url: url,
    dataType: 'json',
    submit: function(e, data) {
    	console.log("File submitted for conversion");
    	$(".progress-bar-success").css("width", "0%");
    },
    done: function (e, data) {
    
		console.log("Converted syllabus returned");	
		
		// Clean up any existing highlights.
		remove_all_highlights();
		
			
		// Copy to a working document (for highlighting)
		$('#syllabus_iframe').contents().find('body').html(data.result.html_syllabus);
		
		// Also copy to hidden original version in an iframe (for saving)
		$('#original_syllabus_iframe').contents().find('body').html(data.result.html_syllabus);
		
		$(".progress-bar-success").css("width", "0%");
		$("#save_syllabus").click();

    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
    }
}).prop('disabled', !$.support.fileInput)
    .parent().addClass($.support.fileInput ? undefined : 'disabled');



// Set up zoom buttons
$(".zoom_in.btn").click( function() {
	var zoom_level = parseFloat($("#syllabus_iframe").contents().find('body').css("zoom"));
	$("#syllabus_iframe").contents().find('body').css("zoom", zoom_level*1.2);
});

$(".zoom_out.btn").click( function() {
	var zoom_level = parseFloat($("#syllabus_iframe").contents().find('body').css("zoom"));
	$("#syllabus_iframe").contents().find('body').css("zoom", zoom_level/1.2);
});

$(".zoom_fit.btn").click( function() {
	$("#syllabus_iframe").contents().find('body').css("zoom", "1");
});

