/**
 *  RunningMedianTracker
 *  A collection of two heaps, one max heap and one min heap.
 *	The min heap stores the greater half of the values, and
 * 	the max heap stores the lesser half of the values. This allows
 * 	for an O(1) calculation of the median of the values.
 */

// DEPENDENCY

var Heap = require('./Heap.js');

// CONSTUCTOR

function RunningMedianTracker () {

	// minHeap stores the top half of the values, maxHeap the bottom half
    this.minHeap = new Heap();
    this.maxHeap = new Heap(Heap.prototype.maxComparator);
    this.size = 0;

}

// CLASS METHODS

/**
 *	Remove a value from the structure.
 */
RunningMedianTracker.prototype.remove = function(value){

	// Figure out which heap the value would be in and try to remove it.
	if(this.minHeap.size > 0 && this.minHeap.peek() <= value){
		this.minHeap.remove(value);
	} else{
		this.maxHeap.remove(value);
	}

	this._updateSize();
	this._balance();
};

/**
 *	Add a value to the structure.
 */
RunningMedianTracker.prototype.add = function(value){

	// If there are only two elements, make sure they go in the correct heap
	if(this.size === 1){
		var existingValue = this.maxHeap.size ? this.maxHeap.poll() : this.minHeap.poll();
		if(value < existingValue){
			this.maxHeap.add(value);
			this.minHeap.add(existingValue);
		} else {
			this.maxHeap.add(existingValue);
			this.minHeap.add(value);
		}
		this._updateSize();
		return;
	}

	// Otherwise, add it to the heap where it belongs and balance the heaps
	if(this.maxHeap.peek() > value){
		this.maxHeap.add(value);
	} else{
		this.minHeap.add(value);
	}

	this._updateSize();
	this._balance();
};

/**
 *	Determine the median of the values.
 */
RunningMedianTracker.prototype.computeMedian = function(){

	// If one heap is bigger, its root is the median
	if(this.minHeap.size > this.maxHeap.size){
		return this.minHeap.peek();
	}
	if(this.minHeap.size < this.maxHeap.size){
		return this.maxHeap.peek();
	}
	// Otherwise the median is the average of the roots
	else{
		var m1 = this.maxHeap.peek();
		var m2 = this.minHeap.peek();
		return (m1 + m2) / 2;
	}
};

/**
 *	Update the values in the data structure based on adjustments returned from
 * 	the adjacency list.
 */
RunningMedianTracker.prototype.applyAdjustments = function(adjustmentMatrix){
	for(var i = 0; i < adjustmentMatrix.length; i++){

		var priorEdgeCount = adjustmentMatrix[i][0];
		var newEdgeCount = adjustmentMatrix[i][1];

		// Skip this entry if nothing changed
		if (priorEdgeCount === newEdgeCount) continue;

		// If its not a new vertex remove the old count from the heaps
		if (priorEdgeCount > 0){
			this.remove(priorEdgeCount);
		}

		// If its not a vertex being removed, add the new edge count
		if (newEdgeCount > 0){
			this.add(newEdgeCount);
		}
	}
};

// INTERNAL METHODS

/**
 *	Balance the two heaps so that none is more than one larger
 *	the other.
 */
RunningMedianTracker.prototype._balance = function(){

	// If a heap is more than one node larger than the other,
	// move its root to the smaller heap
	while(this.minHeap.size > this.maxHeap.size + 1){
		var minRoot = this.minHeap.poll();
		this.maxHeap.add(minRoot);
	}

	while(this.maxHeap.size > this.minHeap.size + 1){
		var maxRoot = this.maxHeap.poll();
		this.minHeap.add(maxRoot);
	}
};

/**
 *	Update the total number of values in the tracker.
 */
RunningMedianTracker.prototype._updateSize = function(){
	this.size = this.minHeap.size + this.maxHeap.size;
};

//EXPORTS

module.exports = RunningMedianTracker;