/**
 *  VenmoGraphEdge
 * 	An object representing an edge on the graph.
 */

// CONSTUCTOR

function VenmoGraphEdge (userId) {

    this.userId = userId;
    this.messageCount = 1;

}

// EXPORTS

module.exports = VenmoGraphEdge;