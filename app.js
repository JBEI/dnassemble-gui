var app = require('express')();
var multer	= require('multer');
var exec 		= require('child_process').exec;
var time = Date.now();
var ioDir = "/work/gui/io/" + time + "/";
var inputFilePath;
var doneUploading = false;
var doneProcessing = false;
var command = function() { return "DNAssemble_ScreenedGBlockLocal.pl -input " + inputFilePath +
	" -anonkey " + time +
	" -assemblyTm 70 " +
	" --destination_vector pENTR_SD_SmaI " +
	" --GC_GLOBAL_MIN 25 " +
	" --GC_GLOBAL_MAX 69 " +
	" --GC_REGIONAL_WINDOW 100 " +
	" --GC_REGIONAL_MIN 28 " +
	" --GC_REGIONAL_MAX 77 " +
	" --GC_LOCAL_WINDOW 20 " +
	" --GC_LOCAL_MIN 15 " +
	" --GC_LOCAL_MAX 90 " +
	" --GC_TERMINAL_WINDOW 20 " +
	" --GC_TERMINAL_MIN 24 " +
	" --GC_TERMINAL_MAX 76 " +
	" --HP_A_LENGTH 12 " +
	" --HP_T_LENGTH 12 " +
	" --HP_C_LENGTH 8 " +
	" --HP_G_LENGTH 8 " +
	" --DIMER_LIMIT 9 " +
	" --TRIMER_LIMIT 9 " +
	" --DR_LOCAL_WINDOW 70 " +
	" --DR_LOCAL_RATIO 90 " +
	" --DR_REGIONAL_WINDOW 500 " +
	" --DR_REGIONAL_RATIO 60 " +
	" --DR_GLOBAL_RATIO 69 " +
	" --DR_SOLO_RATIO 0.4 " +
	" --DR_LENGTH 8 " +
	" --IR_LENGTH_MIN 16 " +
	" --IR_LENGTH_MAX 19 " +
	" --IR_WIDTH repeat 100 " +
	" --GBLOCK_LENGTH_MIN 140 " +
	" --GBLOCK_LENGTH_MAX 1000 " +
	" --GBLOCK_LENGTH 980 " +
	" --GBLOCK_OVERLAP 40 " +
	" --OLIGO_LENGTH_MIN 45 " +
	" --OLIGO_LENGTH_MAX 200 " +
	" --OLIGO_LENGTH oligo 150 " +
	" --OLIGO_OVERLAP_MIN 10";
};

var callback = function(error, stdout, stderr){
	console.log(stdout);
	console.log(stderr);
};

app.use(multer({ dest: ioDir,
	removeExtensionAfterRename: true,
	rename: function (fieldname, filename) {
		return "input";
	},
	onFileUploadComplete: function (file) {
		inputFilePath = file.path;
	  console.log('File uploaded to\n' + ioDir);
	  doneUploading = true;
	}
}));

app.get('/',function(request , response){
	response.sendFile("/work/gui/index.html");
});

app.get('/ass', function(req, res){ 
exec('ls -lah /tmp', function(error, stdout, stderr){
		console.log(stdout);
	});
});

app.post('/upload', function(request, response){
	while(true){
		if(doneUploading === true){
			doneUploading = false;
			doneProcessing = false;
			exec(command(), {cwd: ioDir + '../'}, callback);
			response.end("file uploaded");
			break;
		}
	}
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});