// DEPENDENCY

var fs = require('fs');
var JSONStream = require('JSONStream');
var VenmoTransactionGraph = require('./VenmoTransactionGraph.js');
var VenmoTransaction = require('./VenmoTransaction.js');

// ARGS

var inputFile = process.argv[2];
var outputFile = process.argv[3];

if ( !inputFile || !outputFile ){
    console.log('usage:\n node run.js inputFile outputFile');
    process.exit(1);
}

// VARS

var venmoTransactionGraph = new VenmoTransactionGraph();
var inputStream = fs.createReadStream(inputFile, {encoding: 'utf8'});
var outputStream = fs.createWriteStream(outputFile, {flags:'w'});


// RUN

inputStream.pipe(JSONStream.parse()).on('data', function (transactionJson){

    var venmoTransaction = new VenmoTransaction(transactionJson);

    // If it's not a valid transaction, don't process it
    if( venmoTransaction.validate() ){
	    venmoTransactionGraph.processTransaction(venmoTransaction);

	    var currentMedian = venmoTransactionGraph.computeMedian();
    	outputStream.write(currentMedian.toFixed(2) + "\n");
	}
});

inputStream.on('end', function(){
    outputStream.end();
});


// ERROR HANDLING

inputStream.on('error', function () {
    process.exit(1);
});

outputStream.on('error', function () {
    process.exit(1);
});

