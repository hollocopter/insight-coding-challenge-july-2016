/**
 *  VenmoAdjacencyList
 *  A map representing a graph linking Venmo users.
 *	A map key is a vertex. The corresponding value
 * 	is the list of edges to other vertices.
 */

// DEPENDENCY

var VenmoGraphEdge = require('./VenmoGraphEdge.js');

// CONSTUCTOR

function VenmoAdjacencyList () {

    this.adjacencyList = new Map();

}

// CLASS METHODS

/**
 *  Evict the given transaction from the graph and return any adjustments to the number
 * 	of edges in the graph.
 */
VenmoAdjacencyList.prototype.evictTransaction = function(venmoTransaction){
	var edgeAdjustments = [];
	edgeAdjustments.push(this._decrementEdge(venmoTransaction.actor, venmoTransaction.target));
	edgeAdjustments.push(this._decrementEdge(venmoTransaction.target, venmoTransaction.actor));
	return edgeAdjustments
};

/**
 *  Insert the given transaction into the graph and return any adjustments to the number
 * 	of edges in the graph.
 */
VenmoAdjacencyList.prototype.insertTransaction = function(venmoTransaction){
	var edgeAdjustments = [];
	edgeAdjustments.push(this._incrementEdge(venmoTransaction.actor, venmoTransaction.target));
	edgeAdjustments.push(this._incrementEdge(venmoTransaction.target, venmoTransaction.actor));
	return edgeAdjustments
};

// INTERNAL METHODS

/**
 *  Decrement the graph edge between the given vertex and user. If there are no
 *	longer any messages for this edge, remove it. If there are no longer any
 *	edges for this vertex, remove it.
 */
VenmoAdjacencyList.prototype._decrementEdge = function(vertex, edgeUserId){

	// Keep track of the number of edges being removed
	var edgeAdjustment = 0;

	// Get all edges for the vertex
	var edgeSet = this.adjacencyList.get(vertex);
	if( !edgeSet ) return;

	// Store the incoming number of edgess
	var edgeCountIncoming = edgeSet.length;

	// Find the edge to decrement
	var targetEdge = edgeSet.find(function(comparison){
		return comparison.userId === edgeUserId;
	});

	if( !targetEdge ) return;

	// Decrement messageCount and remove the edge if it has no messages left.
	targetEdge.messageCount--;

	if ( targetEdge.messageCount === 0 ){
		edgeSet.splice(edgeSet.indexOf(targetEdge),1);
		edgeAdjustment++;
	}

	// Determine the outgoing number of edges
	var edgeCountOutgoing = edgeCountIncoming - edgeAdjustment;

	// If the vertex no longer has edges, remove it.
	if ( edgeSet.length === 0 ){
		this.adjacencyList.delete(vertex);
	}

	// Return any adjustments to the number of edges in order to inform the median tracker
	return [edgeCountIncoming, edgeCountOutgoing];
};

/**
 *  Increment the graph edge between the given vertex and user. If there is no vertex
 *	yet create it. If there is no edge yet create it.
 */
VenmoAdjacencyList.prototype._incrementEdge = function(vertex, edgeUserId){

	// Keep track of the number of edges being added
	var edgeAdjustment = 0;

	// If the vertex doesn't exist, create it.
	if( !this.adjacencyList.has(vertex) ){
		this.adjacencyList.set(vertex, []);
	}

	var edgeSet = this.adjacencyList.get(vertex);
	var edgeCountIncoming = edgeSet.length;

	// Does this edge already exist?
	var targetEdge = edgeSet.find( function(comparison){
		return comparison.userId === edgeUserId;
	});

	// If the edge doesn't yet exist, create it with a messageCount of 1.
	// Otherwise, increment the edge's messageCount.
	if( !targetEdge ){
		edgeSet.push(new VenmoGraphEdge(edgeUserId));
		edgeAdjustment++;
	}
	else{
		targetEdge.messageCount++;
	}

	var edgeCountOutgoing = edgeCountIncoming + edgeAdjustment;

	// Return any adjustments to the number of edges in order to inform the median tracker
	return [edgeCountIncoming, edgeCountOutgoing];
};

// EXPORTS

module.exports = VenmoAdjacencyList;