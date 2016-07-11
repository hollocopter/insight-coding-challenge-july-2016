/**
 *  VenmoTransaction
 * 	An object to store Venmo JSON data.
 */

// CONSTUCTOR

function VenmoTransaction (transactionJson) {

    this.timestamp = new Date(transactionJson.created_time);
    this.created_time = transactionJson.created_time;
    this.actor = transactionJson.actor;
    this.target = transactionJson.target;

}

// CLASS METHODS

/**
 * 	A comparator to sort transactions in the priority queue.
 */
VenmoTransaction.prototype.comparator = function(a, b){
	return a.timestamp.getTime() < b.timestamp.getTime();
};

/**
 * 	Make sure a transaction is valid input.
 */
VenmoTransaction.prototype.validate = function(){
	var iso8601RegEx = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/
	if( !this.actor || !this.target || isNaN(this.timestamp.getTime()) || this.actor === this.target || !iso8601RegEx.test(this.created_time) )
		return false;
	return true;
};


// EXPORTS

module.exports = VenmoTransaction;

