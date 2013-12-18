var util = require('util');

// Output a timestamped status message
function update_status(message) {
	
	if (typeof message != "string") { message = util.inspect(message, {colors:true});}

	console.log(moment().format("YYYY-MM-DD HH:mm:ss.SS") + "\t" + message);
}



module.exports.update_status = update_status;