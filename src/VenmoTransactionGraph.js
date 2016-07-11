/**
 *	VenmoTransactionGraph
 *	Maintains the sliding window and handles
 * 	the insertion and eviction of transactions.
 */

// DEPENDENCY

var VenmoTransaction = require('./VenmoTransaction.js');
var VenmoAdjacencyList = require('./data_structures/VenmoAdjacencyList.js');
var Heap = require('./data_structures/Heap.js');
var RunningMedianTracker = require('./data_structures/RunningMedianTracker.js');

// CONSTUCTOR

function VenmoTransactionGraph () {

    this.pQueue = new Heap(VenmoTransaction.prototype.comparator);
    this.windowOpen = new Date(0);
    this.windowClose = new Date(0);
    this.adjList = new VenmoAdjacencyList();
    this.runningMedianTracker = new RunningMedianTracker();

}

// CLASS METHODS

/**
 *	Process an incoming transaction. Update the sliding window if necessary.
 * 	Determine evicted transactions and evict them. Insert the incoming transaction
 * 	if appropriate.
 */
VenmoTransactionGraph.prototype.processTransaction = function (venmoTransaction) {

	// If this is our fist transaction or the most recent one, set or update the window.
	if ( !this.windowClose || this.windowClose < venmoTransaction.timestamp ){
		this.windowClose = venmoTransaction.timestamp;
		this.windowOpen = new Date(venmoTransaction.timestamp - 59999);
	}

	// If the transaction is before the window, don't insert it.
	if( venmoTransaction.timestamp < this.windowOpen ){
		return;
	}

	// Evict transactions that have fallen out of the window.
	while( !this.pQueue.isEmpty() && this.windowOpen.getTime() > this.pQueue.peek().timestamp.getTime() ){
		var evicted = this.pQueue.poll();
		var edgeAdjustments = this.adjList.evictTransaction(evicted);
		this.runningMedianTracker.applyAdjustments(edgeAdjustments);
	}

	// Insert the incoming transaction
	this.pQueue.add(venmoTransaction);
	var edgeAdjustments = this.adjList.insertTransaction(venmoTransaction);
	this.runningMedianTracker.applyAdjustments(edgeAdjustments);

};

/**
 *	Return the median.
 */
VenmoTransactionGraph.prototype.computeMedian = function () {

    return this.runningMedianTracker.computeMedian();

};

// EXPORTS

module.exports = VenmoTransactionGraph;

