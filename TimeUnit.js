/*
    The Countdown Package is a set of widgets for a user-configurable JavaScript Timer
    Copyright (C) 2011  Samuel B. Johnson

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

dojo.provide("net.samuelbjohnson.jsdev.countdown.TimeUnit");

/*
  the TimeUnit object manages a given unit of time, specified as a string
  in the name property. The quantity of time is always measured and stored
  in millisecs and converted when needed for display purposes.

*/
dojo.declare("net.samuelbjohnson.jsdev.countdown.TimeUnit", null, {
    
    /*  The optional params argument can contain any of the other parameters used by the object, including the following properties:
	    
	    quantity: a number representing the initial quantity
	    maximum: the maximum value this TimeUnit should store, in milliseconds
	    greaterNeighbor: the neighbor immediately to the left of this TimeUnit
	    lesserNeighbor: the neighbor immediately to the right of this TimeUnit
    */
    constructor: function(/*numeric*/unitSizeInMillisecs, /*string*/ name,  /*node*/ containerNode, /*object*/ params) {
	this.millisecs = unitSizeInMillisecs;
	this.containerNode = containerNode;
	dojo.empty(this.containerNode);
	dojo.addClass(this.containerNode, "timeUnitContainer");
	this.name = name;
	this.quantity = 0;
	this.maximum = undefined;

	if (typeof params == 'object') {
	    dojo.mixin(this, params);
	}

	this.buildHtmlStructure();
    },

    buildHtmlStructure: function() {
	this.labelNode = dojo.create("div", {
	    class: "timeUnitLabel",
	    innerHTML: this.name
	}, this.containerNode);
	this.quantityNode = dojo.create("div", {
	    class: "timeUnitQuantity",
	    innerHTML: this.quantity
	}, this.containerNode);
    },

    setQuantity: function(/*numeric*/ quantity) {
	this.quantity = quantity;
	this.displayQuantity();
    },

    displayQuantity: function() {
	this.quantityNode.innerHTML = parseInt(this.quantity / this.millisecs);
    },

    
    increment: function() {
	this.quantity += this.millisecs;
	if (this.maximum !== undefined && this.quantity >= this.maximum) {
	    this.quantity = 0;
	    if (typeof this.greaterNeighbor == 'object') {
		(dojo.hitch(this.greaterNeighbor, this.greaterNeighbor.increment))();
	    }
	}
	this.displayQuantity();
    },

    decrement: function() {
	this.quantity -= this.millisecs;
	if (this.maximum !== undefined && this.quantity < 0) {
	    this.quantity = this.maximum - 1;
	    if (typeof this.greaterNeighbor == 'object') {
		(dojo.hitch(this.greaterNeighbor, this.greaterNeighbor.decrement))();
	    }
	}
	this.displayQuantity();
    },

    deleteUnit: function() {
	console.log("deleting time unit: ", this.name);
    }
});