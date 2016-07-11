# Table of Contents

1. [Setup] (README.md#challenge-summary)
2. [Data Structures] (README.md#data-structures)
	- [Priority Queue] (README.md#priority-queue)
	- [Adjacency List] (README.md#adjacency-list)
	- [Running Median Tracker] (README.md#running-median-tracker)
3. [Program Flow] (README.md#program-flow)
4. [Scalability] (README.md#scalability)
5. [Further Considerations] (README.md#further-considerations)
6. [Tests] (README.md#tests)
7. [Dependencies] (README.md#dependencies)

A Node.js solution to the [Insight Data Engineering Coding Challenge] (https://github.com/InsightDataScience/coding-challenge)

##Setup
[Back to Table of Contents] (README.md#table-of-contents)

	git clone https://github.com/hollocopter/insight-coding-challenge-july-2016.git
	npm install // Intall dependencies
	npm test // Run unit tests

##Data Structures
[Back to Table of Contents] (README.md#table-of-contents)

There are three data structures central to this solution. These three structures comprise the greater abstract data structure VenmoTransactionGraph.

###Priority Queue

The priority queue is used to efficiently determine which transactions are to be evicted from the graph at any given time. As each transaction is processed, if it is within the 60 second window (or newer than the window), it is inserted into the priority queue. The priority queue is ordered such that the oldest transaction within the queue is first. As such we have access to peek or pop the oldest transaction in _O(1)_ time and insert a new transaction in _O(log(n))_ time.

###Adjacency List

The graph itself is represented with a map based adjacency list, where each key is the user ID of a vertex, and each value is an array of objects corresponding to the edges of the vertex.

Each edge is represented as an object with two properties: `userId` and `messageCount`. The reason for this structure is to handle scenarios in which a transaction is to be evicted, but another transaction for the same edge still exists within the 60 second window. If `messageCount` will be incremented and decremented as needed when transactions are processed. A vertex will only ever be evicted when its `messageCount` reaches 0.

###Running Median Tracker

The running median tracker is represented with two heaps that contain the degree of each vertex in the graph. Each heap stores one half of the degree values: a min heap storing the greater half of the vertex degrees, and a max heap storing the lesser half of the vertex degrees. Using this structure allows for _O(log(n))_ insertion of a new vertex and _O(1)_ retrieval of the median via the following algorithm:

	If one heap is larger than the other
		Return the root of the larger heap.
	Otherwise return the average of the two roots.

Further details on the ideas behind this data structure are discussed [here.] (http://stackoverflow.com/questions/10657503/find-running-median-from-a-stream-of-integers)

One further complicating factor in this particular problem is the possibility that vertices may need to be evicted from the graph. With the current solution, this removal of the vertex from the median tracker takes _O(n)_ time. See [Further Considerations] (README.md#further-considerations) for thoughts on possible improvements. Even still, this solution should be considerably faster than a naive algorithm to iterate the [Adjacency List] (README.md#adjacency-list) and sort the degrees of each vertex to determine the median.

##Program Flow
[Back to Table of Contents] (README.md#table-of-contents)

run.js serves as an entry point to the program. It initializes the VenmoTransactionGraph and creates an input stream from which to read the data and an output stream to write the median values to. Input is parsed into transaction objects, which are then validated for proper format before any more actions are taken. If an object passes validation it is sent to the VenmoTransactionGraph for processing.

The VenmoTransactionGraph is comprised of the three [Data Structures] (README.md#data-structures) outlined above. It also keeps track of and updates the current 60 second window as it processes each transaction. It first determines if it must update the current window based on the incoming transaction. Or, if the incoming transaction is already passed the window, it ignores it and does no further processing. Any transactions that have fallen out of the window are evicted from the data structures. These are determined by looking at top value of the priority queue, until no more transactions need to be evicted. The incoming transaction is then inserted into the data structures. During evictions and insertions, the adjacency list must inform the median tracker to any changes in the number or degree of the vertices.

After the transaction has been fully processed by the VenmoTransactionGraph, the median is computed and written to the output stream.

##Scalability
[Back to Table of Contents] (README.md#table-of-contents)

Data streams were purposefully used in this solution for two reasons.

- To avoid loading the entire input into memory up front.

- To simulate reading from a streaming api. We process one record at a time, and go back to the stream to fetch more when we have completed.

The [Data Structures] (README.md#data-structures) were chosen for performance reasons over simplicity. In larger test cases (~1 million transactions) the solution has been able to process upwards of 15,000 transactions per second on my personal computer. These results are also likely dependent on the density of the graph, as I believe the removal of vertices is currently the slowest operation (See [Further Considerations] (README.md#further-considerations) for more discussion).

##Further Considerations
[Back to Table of Contents] (README.md#table-of-contents)

With more time it may be possible to improve upon the current solution in the following ways:

- Consider abstracting the rolling window and passing it in to the constructor for the VenmoTransactionGraph. This would make it simple to solve this problem for different rolling window sizes.

- Consider ways of improving the performance of the Heap remove function. With the current _O(n)_ runtime of this operation, it's likely the slowest operation for maintaining the RunningMedianTracker data structure. It may be possible to achieve _O(log(n))_ for this operation at the cost of extra memory by adding some extra hashmaps as described in the answer to [this] (http://stackoverflow.com/questions/17009056/how-to-implement-ologn-decrease-key-operation-for-min-heap-based-priority-queu) stackoverflow question.

##Tests
[Back to Table of Contents] (README.md#table-of-contents)

Unit testing code can be found in the `test` directory. Unit tests were built using the [mocha] (https://mochajs.org/) test framework and the [chai] (http://chaijs.com/) assertion library. Unit tests can be executed from by running `npm test` in the root directory.

In addition to the unit tests, a number of additional integration tests have been added to the `insight_testsuite` directory.

##Dependencies
[Back to Table of Contents] (README.md#table-of-contents)

This project was built with the Node.js technology. As such, Node.js must be installed in the environment in order for this project to run. Cloud9 ([c9.io] (https://c9.io)) conveniently has Node.js workspace templates that can run this project.

This project requires the following npm packages to be installed.

- [fastpriorityqueue] (https://www.npmjs.com/package/fastpriorityqueue): A performant heap based priority queue implementation.

- [JSONStream] (https://www.npmjs.com/package/JSONStream): A convenience library for parsing JSON from a stream.

- [mocha] (https://www.npmjs.com/package/mocha): Unit testing framework.

- [chai] (https://www.npmjs.com/package/chai): Assertion library for unit testing.

These dependencies can be installed by running `npm install` in the root directory.