// wit imports
var wit = require('node-wit');
var fs = require('fs');
var ACCESS_TOKEN = "D2IKMCMYZWHBCRIPVHSBLKI67WZPRGZE";

// lifx
var lifx = require("lifx");
var lx   = lifx.init();

// recorder
var sys = require('sys')
var exec = require('child_process').exec;

function listen () {
	function puts(error, stdout, stderr) { 
		sys.puts(stdout) 
	}
	exec("bash record.sh", puts);
}

fs.watchFile('sample.wav', function (curr, prev) {
  console.log('new recording saved');
  var fileSize = getFileSize('sample.wav')
  if  (fileSize > 300) {
  	  post_file(listen);
  	  console.log(fileSize);
  } else {
  	console.log("nothing substantial recorded");
  	console.log(fileSize);
  	listen();
  }
});

function getFileSize(filename) {
 var stats = fs.statSync(filename)
 var fileSizeInBytes = stats["size"]
 return fileSizeInBytes
}


function post_file (callback) {
	var stream = fs.createReadStream('sample.wav');
	wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/wav", function (err, res) {
	    console.log("Response from Wit for audio stream: ");
	    if (err) {
	    	console.log("Error: ", err);
	    } else {
	    	console.log(JSON.stringify(res, null, " "));
	    	var outcomes = res.outcomes;
	    	var intent = res.outcomes[0].intent;
	    	if (!outcomes.length == 0) {
		    	if (intent === "UNKOWN") {
		    		console.log("sorry didn't catch that");
		    	} else if(intent === "state") {
		    		var entities = res.outcomes[0].entities
		    		var state = entities.on_off[0].value
		    		changeLightsState(state);
		    	}
	    	}
			
	    }
	    
	    callback();
	});
}

function changeLightsState (state) {
	console.log('lights changing')
	if (state === "on") {
		lx.lightsOn();
	} else {
		lx.lightsOff();
	}
}

lx.on('bulb', function(b) {
	console.log('New bulb found: ' + b.name);
});


listen();

