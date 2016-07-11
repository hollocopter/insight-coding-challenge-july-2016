// DEPENDENCY

var VenmoAdjacencyList = require('../../src/data_structures/VenmoAdjacencyList.js');
var VenmoTransaction = require('../../src/VenmoTransaction.js')
var expect = require('chai').expect;

// TEST VALUES

var tran1 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Joe", "actor": "Frank"});
var tran2 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Joe", "actor": "Rob"});
var tran3 = new VenmoTransaction({"created_time": "2016-04-07T03:33:00Z", "target": "Frank", "actor": "Rob"});

// TESTS

describe('VenmoAdjacencyList', function(){

	describe('#insertTransaction', function(){

		it('should create a new vertex if it does not yet exist', function(done){
			mockAdjList = new VenmoAdjacencyList();

			var joeVertex1 = mockAdjList.adjacencyList.get('Joe');

			mockAdjList.insertTransaction(tran1);

			var joeVertex2 = mockAdjList.adjacencyList.get('Joe');

			expect(joeVertex1).to.be.undefined;
			expect(joeVertex2).to.have.lengthOf(1);
			done();
		});

		it('should insert new edges if they do not yet exist', function(done){
			mockAdjList = new VenmoAdjacencyList();

			mockAdjList.insertTransaction(tran1);

			var joeVertex = mockAdjList.adjacencyList.get('Joe');

			expect(joeVertex).to.have.lengthOf(1);

			mockAdjList.insertTransaction(tran2);

			expect(joeVertex).to.have.lengthOf(2);
			done();
		});

		it('should increment the messageCount of an edge that already exists', function(done){
			mockAdjList = new VenmoAdjacencyList();

			mockAdjList.insertTransaction(tran1);
			mockAdjList.insertTransaction(tran2);

			var joeVertex = mockAdjList.adjacencyList.get('Joe');

			expect(joeVertex).to.have.lengthOf(2);

			var robIndex = -1
			for (var i = 0; i < joeVertex.length; i++){
				if ( joeVertex[i].userId === 'Rob'){
					robIndex = i;
					break;
				}
			}

			expect(joeVertex[robIndex].messageCount).to.be.equal(1);

			mockAdjList.insertTransaction(tran2);
			expect(joeVertex[robIndex].messageCount).to.be.equal(2);

			done();
		});
	});

	describe('#evictTransaction', function(){

		it('should remove the edge if it no longer has a positive messageCount', function(done){
			mockAdjList = new VenmoAdjacencyList();

			mockAdjList.insertTransaction(tran1);
			mockAdjList.insertTransaction(tran2);

			var joeVertex = mockAdjList.adjacencyList.get('Joe');

			expect(joeVertex).to.have.lengthOf(2);

			mockAdjList.evictTransaction(tran2);

			expect(joeVertex).to.have.lengthOf(1);
			done();
		});

		it('should decrement the messageCount of an edge with more than one messageCount', function(done){
			mockAdjList = new VenmoAdjacencyList();

			mockAdjList.insertTransaction(tran1);
			mockAdjList.insertTransaction(tran2);
			mockAdjList.insertTransaction(tran2);

			var joeVertex = mockAdjList.adjacencyList.get('Joe');

			expect(joeVertex).to.have.lengthOf(2);

			var robIndex = -1
			for (var i = 0; i < joeVertex.length; i++){
				if ( joeVertex[i].userId === 'Rob'){
					robIndex = i;
					break;
				}
			}

			expect(joeVertex[robIndex].messageCount).to.be.equal(2);

			mockAdjList.evictTransaction(tran2);

			expect(joeVertex[robIndex].messageCount).to.be.equal(1);
			done();
		});

		it('should delete the vertex if it no longer has any edges', function(done){
			mockAdjList = new VenmoAdjacencyList();

			mockAdjList.insertTransaction(tran1);

			var joeVertex1 = mockAdjList.adjacencyList.get('Joe');
			expect(joeVertex1).to.have.lengthOf(1);

			mockAdjList.evictTransaction(tran1);

			var joeVertex2 = mockAdjList.adjacencyList.get('Joe');

			expect(joeVertex2).to.be.undefined;
			done();
		});
	});
});