//Ben F Rayfield offers ProofOfWorkForestSum.js/powsum as opensource MIT license.
//
//I know of a way to sum proof of work from many computers into a single number. Basically a forest of hash nodes that each count the
//total nodes and total proofOfWork below them. I could in theory put ed25519 pubkeys as leafs. Always take the max proofOfWork node as state.
//This kind of web3 data structure would be capable of garbage-collection since it only stores content in leafs.
//
const Powsum = {

	//TODO if i want to allow ed25519 pubkeys to spread out in 2d dagplace, to have limits of the number of them per nearby 2d area,
	//how would this Powsum system do that? It only has a ns.maxCost but not more complicated combos of leaf data
	//(data being such pubkeys and things theyre allowed to sign as defined in the prefix of the pubkey string).

	Namespace: function(){
		this.description = 'Experimental namespace for ed25519 pubkeys to join a dagplace peer to peer network while limiting total number of pubkeys to avoid sybilAttacks. salt3453453453243245.',
		//TODO an ed25519 key has a higher cost the bigger byte array it can sign at once, include that max size, and max number of dagplace pixels it can sign at once etc.
		this.costFunc = leaf=>1;
		this.maxCost = 1000000;
		this.maxDepth = 100;
		this.maxNodes = this.maxCost*3; //max nodes reachable from any one node, but you can have lots of competing nodes that together far exceed this.
		//seconds. TODO make this a week or an hour etc, depending how many ppl using it together, to motivate replacing old leafs with new leafs and growing up to maxNodes etc.
		//Starting it as 1 minute for now for testing, but raise it later.
		this.halflife = 60; //seconds. TODO 7*24*60*60 or 60*60 etc?
		//TODO choose one that requires more CPU L3 cache than GPU has, doesnt fit in a GPU core, maybe a modified SHA256
		//ith extra read-only constants that it jumps around based on hash state or something.
		this.hashFunc = null;
		this.bestNode = null; //TODO this should be the node with the highest node.totalPOW or maybe create a node.score that also considers node.totalCost etc.
		//if successful, replaces ns.bestNode, though normally you'd try to just create alternate middle nodes and have those with more compute power add what you
		//created cuz it helps them create a new highest scoring bestNode.
		//This is how a new player would join a dagplace website and peer to peer network, by doing proofOfWork to add their generated ed25519 pubkey as a leaf.
		this.doProofOfWorkTryingToAddLeafData = function(data, maxComputePower){
			throw new Error('TODO');
		};
	},

	//forest node. Content (such as ed25519 pubkey and limits on what its allowed to sign) is in leafs. Hashes and counts are in nonleafs.
	Node: function(ns, data, childs, time){
		this.ns = ns;
		this.data = data; //string (or bytes?) if leaf, else null.
		this.childs = childs; //list of child nodes. [] if leaf. Probably is always size 2 for nonleaf.
		//TODO somehow this should be used to decay totalPOW andOr localPOW. See this.ns.halflife. Weight is 0 before that time,
		//and weight is this.totalPOW*Math.exp(timeAfter*someConstantDoingTheHalflife) (or this.score or something?) after that
		this.time = time; //must be equal or greater time than every child.
		this.depth = 0;
		if(this.childs.length) for(let i=0; i<this.childs.length; i++) this.depth = Math.max(this.depth, this.childs[i].depth+1);
		if(this.depth > ns.maxDepth){
			throw new Error('depth '+this.depth+' > ns.maxDepth '+ns.maxDepth);
		}
		this.localCost = ns.costFunc(this); //FIXME only leafs should have cost.
		this.localPOW = this.computeLocalPOW();
		let allNodesReachableFromHere = this.nodesReachableSet(); //expensive calculation but needed to make sure everyone has all the nodes and to keep it to fewer nodes.
		//FIXME make allNodesReachableFromHere return a list?
		this.totalNodes = allNodesReachableFromHere.length;
		if(this.totalNodes > ns.maxNodes){
			throw new Error('totalNodes '+this.totalNodes+' > ns.maxNodes '+ns.maxNodes);
		};
		this.totalCost = sum allNodesReachableFromHere[each].localCost;
		//FIXME node.localPOW should be viewed as decaying (by ns.halflife), so if this.time differs from the time of
		//child nodes recursively then totalPOW must be adjusted for that particular time. Thats simple enough to do in math but creates a roundoff problem.
		//Since all nodes have the same halflife, totalPOW decays by that halflife nomatter where its viewed from.
		if(this.totalCost > ns.maxCost){
			throw new Error('totalCost '+this.totalCost+' > ns.maxCost '+ns.maxCost);
		}
		this.totalPOW = sum localPOW from each in allNodesReachableFromHere;
		//TODO ns.bestNode is set to the Node of max score. No blockchain consensus. Just broadcast the ns.bestScore
		//and try to find higher scoring ns.bestScore, considering that score decays with ns.halflife so score can actually
		//increase forever without overflowing the numbers.
		//TODO should score be an int256 or float64 or what? must at least be able to sort by them. Tie breakers if float64 could be to compare by node.id.
		this.score = TODO;
		this.id = this.hash(); //FIXME make sure to include the total* vars in id? or 1 level below?
		FIXME how to add decay (maybe with halflife of 1 week or 1 hour, depending how many ppl are using it at the time, to motivate gradually adding more leafs replacing older leafs?)
			I want totalPOW to be viewed as decaying.
		
	},

	/*Leaf: function(data, ns){
		this.data = data;
		this.cost = ns.costFunc(this);
	},

	Branch: function(){
		this.childs = [];
	},*/


};

Powsum.Node.prototype.nodesReachable = function(optionalSet){
	let set = optionalSet || new Set();
	for(let i=0; i<this.childs.length; i++){
		this.childs[i].nodesReachable(set);
	}
	set.add(this);
	return set;
};

