// DEPENDENCY

var Heap = require('../../src/data_structures/Heap.js');
var expect = require('chai').expect;

// TEST VALUES

var comparator = function(a,b){
	return a < b;
};

// TESTS

describe('Heap', function(){

	describe('#remove', function(){
		it('should not affect an empty heap', function(done){
			var mockHeap = new Heap(comparator);

			mockHeap.remove(4);

			expect(mockHeap.array.length).to.be.equal(0);
			expect(mockHeap.size).to.be.equal(0);
			expect(mockHeap.size).to.not.be.equal(-1);
			done();
		});

		it('should remove an instance of the target value from the heap', function(done){
			var mockHeap = new Heap(comparator);
			mockHeap.add(4);
			mockHeap.add(1);
			mockHeap.add(3);
			mockHeap.remove(1);

			for (var i = 0; i < mockHeap.size; i++){
				expect(mockHeap.array[i]).to.not.be.equal(1);
			}
			done();
		});
	});
});