// DEPENDENCY

var VenmoTransactionGraph = require('../src/VenmoTransactionGraph.js');
var VenmoTransaction = require('../src/VenmoTransaction.js');
var expect = require('chai').expect;

// TEST VALUES

var tran1_1 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Joe", "actor": "Frank"});
var tran1_2 = new VenmoTransaction({"created_time": "2016-04-07T03:33:10Z", "target": "Joe", "actor": "Rob"});

var tran2_1 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Joe", "actor": "Frank"});
var tran2_2 = new VenmoTransaction({"created_time": "2016-04-07T03:33:10Z", "target": "Joe", "actor": "Rob"});
var tran2_3 = new VenmoTransaction({"created_time": "2016-04-07T03:34:00Z", "target": "Frank", "actor": "Rob"});

var tran3_1 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Joe", "actor": "Frank"});
var tran3_2 = new VenmoTransaction({"created_time": "2016-04-07T03:33:10Z", "target": "Joe", "actor": "Rob"});
var tran3_3 = new VenmoTransaction({"created_time": "2016-04-07T03:31:00Z", "target": "Frank", "actor": "Rob"});

var tran4_1 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Joe", "actor": "Frank"});
var tran4_2 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Joe", "actor": "Rob"});
var tran4_3 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Frank", "actor": "Rob"});

// TESTS

describe('VenmoTransactionGraph', function(){

	describe('#processTransaction', function(){

		it('should update the window when the processed transaction is the most recent one', function(done){
			var mockTranGraph = new VenmoTransactionGraph();

			mockTranGraph.processTransaction(tran1_1);
			var windowClose1 = mockTranGraph.windowClose;
			var windowOpen1 = mockTranGraph.windowOpen;

			mockTranGraph.processTransaction(tran1_2);
			var windowClose2 = mockTranGraph.windowClose;
			var windowOpen2 = mockTranGraph.windowOpen;

			expect(windowOpen1).to.be.not.equal(windowOpen2);
			expect(windowClose1).to.be.not.equal(windowClose2);
			done();
		});

		it('should evict transactions that fall out of the processing window', function(done){
			var mockTranGraph = new VenmoTransactionGraph();
			mockTranGraph.processTransaction(tran2_1);
			mockTranGraph.processTransaction(tran2_2);
			mockTranGraph.processTransaction(tran2_3);
			expect(mockTranGraph.computeMedian()).to.be.equal(1);
			expect(mockTranGraph.computeMedian()).to.not.be.equal(2);
			done();
		});

		it('should skip transactions that are outside of the processing window', function(done){
			var mockTranGraph = new VenmoTransactionGraph();
			mockTranGraph.processTransaction(tran3_1);
			mockTranGraph.processTransaction(tran3_2);
			mockTranGraph.processTransaction(tran3_3);
			expect(mockTranGraph.computeMedian()).to.be.equal(1);
			expect(mockTranGraph.computeMedian()).to.not.be.equal(2);
			done();
		});
	});

	describe('#computeMedian', function(){

		it('should return the median from the RunningMedianTracker', function(done){
			var mockTranGraph = new VenmoTransactionGraph();
			mockTranGraph.processTransaction(tran4_1);
			mockTranGraph.processTransaction(tran4_2);
			mockTranGraph.processTransaction(tran4_3);

			trackerMedian = mockTranGraph.runningMedianTracker.computeMedian();
			tranGraphMedian = mockTranGraph.computeMedian();

			expect(tranGraphMedian).to.be.equal(tranGraphMedian);
			done();
		});
	});
});