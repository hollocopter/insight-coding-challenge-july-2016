// DEPENDENCY

var RunningMedianTracker = require('../../src/data_structures/RunningMedianTracker.js');
var expect = require('chai').expect;

// TESTS

describe('RunningMedianTracker', function(){

	describe('#RunningMedianTracker', function(){

		it('should have no values in maxHeap greater than any value in minHeap', function(done){
			var mockMedian = new RunningMedianTracker();
			mockMedian.add(4);
			mockMedian.add(10);
			mockMedian.add(11);
			mockMedian.add(1);
			mockMedian.add(100);
			mockMedian.add(5);
			mockMedian.add(17);
			mockMedian.add(21);

			var failed = false;
			for (var i = 0; i < mockMedian.maxHeap.size; i++){
				for (var j = 0; j < mockMedian.minHeap.size; j++){
					if ( mockMedian.maxHeap.array[i] > mockMedian.minHeap.array[j])
						failed = true;
				}
			}

			expect(failed).to.be.false;
			done();
		});
	});

	describe('#computeMedian', function(){

		it('should return the only value if the total size is 1', function(done){
			var mockMedian = new RunningMedianTracker();
			mockMedian.add(4);

			var median = mockMedian.computeMedian();
			expect(median).to.be.equal(4);
			done();
		});

		it('should return the average of the min and max root if the total size is even', function(done){
			var mockMedian = new RunningMedianTracker();
			mockMedian.add(4);
			mockMedian.add(10);
			mockMedian.add(11);
			mockMedian.add(1);
			mockMedian.add(100);
			mockMedian.add(5);

			var median = mockMedian.computeMedian();
			expect(mockMedian.minHeap.peek()).to.be.equal(10);
			expect(mockMedian.maxHeap.peek()).to.be.equal(5);
			expect(median).to.be.equal(7.50);
			done();
		});
	});

	describe('#add', function(){

		it('should increase the size property', function(done){
			var mockMedian = new RunningMedianTracker();
			originalSize = mockMedian.size;
			mockMedian.add(100);
			newSize = mockMedian.size;
			mockMedian.add(4);
			mockMedian.add(5);
			newSize2 = mockMedian.size;

			expect(originalSize).to.be.equal(newSize - 1);
			expect(newSize).to.be.equal(newSize2 - 2);
			done();
		});

		it('should add the smaller of the first two values to maxHeap, and the larger to minHeap', function(done){
			var mockMedian1 = new RunningMedianTracker();
			var mockMedian2 = new RunningMedianTracker();
			mockMedian1.add(1);
			mockMedian1.add(10);
			mockMedian2.add(10);
			mockMedian2.add(1);

			expect(mockMedian1.minHeap.peek()).to.be.equal(10);
			expect(mockMedian1.maxHeap.peek()).to.be.equal(1);

			expect(mockMedian2.minHeap.peek()).to.be.equal(10);
			expect(mockMedian2.maxHeap.peek()).to.be.equal(1);
			done();
		});
	});

	describe('#remove', function(){

		it('should decrease the size property', function(done){
			var mockMedian = new RunningMedianTracker();
			mockMedian.add(100);
			mockMedian.add(4);
			mockMedian.add(5);
			originalSize = mockMedian.size;

			mockMedian.remove(100);
			newSize = mockMedian.size;

			expect(originalSize).to.be.equal(newSize + 1);
			done();
		});

		it('should not change the size property when the argument does not exist in the data structure',function(done){
			var mockMedian = new RunningMedianTracker();
			mockMedian.add(100);
			mockMedian.add(4);
			mockMedian.add(5);
			originalSize = mockMedian.size;

			mockMedian.remove(14);
			newSize = mockMedian.size;

			expect(originalSize).to.be.equal(newSize);
			done();
		});

		it('should remove the value specified', function(done){
			var mockMedian = new RunningMedianTracker();
			mockMedian.add(4);
			mockMedian.add(5);

			expect(mockMedian.maxHeap.peek()).to.be.equal(4);

			mockMedian.remove(4);

			expect(mockMedian.maxHeap.isEmpty()).to.be.true;
			done();
		});
	});
});