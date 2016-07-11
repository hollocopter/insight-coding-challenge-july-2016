// DEPENDENCY
var VenmoTransaction = require('../src/VenmoTransaction.js');
var expect = require('chai').expect;

// TESTING VALUES

var goodTransaction = {"created_time": "2016-03-29T06:04:50Z", "target": "Joey-Feste", "actor": "Timmy-Tim"};
var badTransaction1 = {"target": "Joey-Feste", "actor": "Joey-Feste"};
var badTransaction2 = {"created_time": "2016-03-29T06:04:50Z", "target": "", "actor": "Joey-Feste"};
var badTransaction3 = {"created_time": "2016-03-29T06:04:50Z", "target": "Joey-Feste", "actor": ""};
var badTransaction4 = {"created_time": "Not A Date", "target": "Joey-Feste", "actor": "Jimmy"};
var badTransaction5 = {"created_time": "2016-03-29T06:04:50Z", "target": "Joey-Feste", "actor": "Joey-Feste"};
var badTransaction6 = {"created_time": "10", "target": "Joey-Feste", "actor": "Jimmy"};
var badTransaction7 = {"created_time": "", "target": "Joey-Feste", "actor": "Timmy-Tim"};

// TESTS

describe('VenmoTransaction', function(){

	describe('#validate', function(){

		it('should validate properly formateed transactions', function(done){
			var goodTran = new VenmoTransaction(goodTransaction);

			expect(goodTran.validate()).to.be.true;
			done();
		});

		it('should not validate transactions with missing or empty properties', function(done){
			var badTran1 = new VenmoTransaction(badTransaction1);
			var badTran2 = new VenmoTransaction(badTransaction2);
			var badTran3 = new VenmoTransaction(badTransaction3);
			var badTran7 = new VenmoTransaction(badTransaction7);

			expect(badTran1.validate()).to.be.false;
			expect(badTran2.validate()).to.be.false;
			expect(badTran3.validate()).to.be.false;
			expect(badTran7.validate()).to.be.false;
			done();
		});

		it('should not validate a transaction with a non date created_time', function(done){
			var badTran4 = new VenmoTransaction(badTransaction4);
			var badTran6 = new VenmoTransaction(badTransaction6);

			expect(badTran4.validate()).to.be.false;
			expect(badTran6.validate()).to.be.false;
			done();
		});

		it('should not validate a transaction with the same target and actor', function(done){
			var badTran5 = new VenmoTransaction(badTransaction5);

			expect(badTran5.validate()).to.be.false;
			done();
		});
	});
});