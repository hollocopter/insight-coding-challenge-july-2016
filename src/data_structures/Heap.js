/**
 *  Heap
 *  Extension of fastpriorityqueue to
 *  add the functionality to remove a value.
 */

// DEPENDENCY

var FastPriorityQueue = require('fastpriorityqueue');

// CONSTRUCTOR

function Heap(comparator){
	FastPriorityQueue.call(this, comparator);
}

Heap.prototype = Object.create(FastPriorityQueue.prototype);

// CLASS METHODS

/**
 *  Remove an element in O(n) time.
 */
Heap.prototype.remove = function(myval) {
	var index = -1;
    for(var i = 0; i < this.size; i++){
    	if( this.array[i] === myval ){
    		index = i;
    		break;
    	}
    }
    // If we didn't find it return
    if ( index === -1) return;

    // Otherwise replace the target with the last item in the array and move it to its proper place;
    var end = this.array[--this.size];
    this.array[index] = end;
    this._percolateUp(index);
    this._percolateDown(index);
};

/**
 *  A comparator for creating a max heap.
 */
Heap.prototype.maxComparator = function(a,b){
	return a > b;
};

//EXPORTS

module.exports = Heap;