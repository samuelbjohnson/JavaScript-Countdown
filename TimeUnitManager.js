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

dojo.provide("net.samuelbjohnson.jsdev.countdown.TimeUnitManager");

dojo.require("dojox.timing");
dojo.require("dojo.date");
dojo.require("dijit.form.Button");
dojo.require("dojo.dnd.Source");
dojo.require("net.samuelbjohnson.jsdev.countdown.TimeUnit");
dojo.require("net.samuelbjohnson.jsdev.countdown.TargetDate");

dojo.declare("net.samuelbjohnson.jsdev.countdown.TimeUnitManager", null, {
    constructor: function(/*node*/ containerNode, /*TargetDate*/ targetDate) {
	var newUnits = new Array();
	this.timeUnits = new Array();

	this.targetDate = targetDate.getDate();
	dojo.connect(targetDate, "setDate", this, function(/*date*/newDate) {
	    this.targetDate = newDate;
	    this.calculateQuantities();
	});

	this.containerNode = containerNode;

	this.source = new dojo.dnd.Source(containerNode, {
	    skipform: true,
	    isSource: true,
	    creator: dojo.hitch(this, this.creator)
	});


	newUnits[0] = new net.samuelbjohnson.jsdev.countdown.TimeUnit(
	    1000, "Seconds", dojo.create("div"));

	this.resetDiv = dojo.create("div", {}, containerNode);
	this.pauseDiv = dojo.create("div", {}, containerNode);

	this.resetButton = new dijit.form.Button({
	    label: "Reset",
	    onClick: dojo.hitch(this, this.refreshTimer)
	}, this.resetDiv);

	this.pauseButton = new dijit.form.Button({
	    label: "Pause",
	    onClick: dojo.hitch(this, this.stopTimer)
	}, this.pauseDiv);

	this.timer = new dojox.timing.Timer(1000);

	this.source.insertNodes(false, newUnits, false, this.pauseDiv);

	dojo.connect(this.source, "onDrop", this, this.onDrop);

	this.targetDate = new Date(2011, 0, 25);

	this.calculateQuantities();
	
	this.timer.onTick = dojo.hitch(this.timeUnits[this.timeUnits.length - 1], this.timeUnits[this.timeUnits.length - 1].decrement);	

    },

    onDrop: function(source, nodes, copy) {
	console.log("time manager onDrop");
	this.reorderUnits();
    },

    creator: function(item, hint) {
	var tempNode, newUnit;
	console.log("timemanager creator called");
	if (hint == "avatar") {
	    tempNode = dojo.doc.createElement("div");
	    dojo.addClass(tempNode, "timeUnitAvatar");
	    return {
		node: tempNode,
		data: item,
		type: this.type
	    };
	} else {
	    newUnit = new net.samuelbjohnson.jsdev.countdown.TimeUnit(item.millisecs, item.name, dojo.create("div"), {quantity: item.quantity});
	    this.addTimeUnit(newUnit);
	    return {
		node: newUnit.containerNode,
		data: newUnit,
		type: this.type
	    };
	}
    },

    startTimer: function() {
	this.timer.start();
    },

    stopTimer: function() {
	this.timer.stop();
    },

    refreshTimer: function() {
	this.calculateQuantities();
	this.timer.stop();
	this.timer.start();
    },

    addTimeUnit: function(/*TimeUnit*/ newUnit) {
	var i, finished, unit;

	finished = false;

	/*  Find the appropriate location within the linked list of TimeUnit objects
	    to insert newUnit
	*/
	for (i = 0; i < this.timeUnits.length; i++) {
	    if (newUnit.millisecs < this.timeUnits[i].millisecs) {
		continue;
	    } else {
		if (newUnit.millisecs === this.timeUnits[i].millisecs) {
		    return;
		}
		unit = this.timeUnits[i];
		newUnit.greaterNeighbor = unit.greaterNeighbor;
		newUnit.lesserNeighbor = unit;
		newUnit.maximum = unit.maximum;
		unit.greaterNeighbor = newUnit;
		unit.maximum = newUnit.millisecs;

		dojo.place(newUnit.containerNode, unit.containerNode, "before");
		
		this.timeUnits.splice(i, 0, newUnit);
		finished = true;
		break;
	    }
	}

	if (! finished) {
	    //newUnit should become the last element in the array

	    if (i != 0) {
		newUnit.greaterNeighbor = this.timeUnits[i - 1];
		this.timeUnits[i - 1].lesserNeighbor = newUnit;
	    
		newUnit.maximum = this.timeUnits[i - 1].millisecs;
	    }
	    
	    this.timeUnits[i] = newUnit;

	    this.timer.onTick = dojo.hitch(newUnit, newUnit.decrement);
	    this.timer.setInterval(newUnit.millisecs);
	}

	dojo.connect(newUnit, "deleteUnit", this, function() {
	    this.removeTimeUnit(newUnit.millisecs);
	    this.calculateQuantities();
	});

	this.calculateQuantities();
    },

    removeTimeUnit: function(/*numeric*/ millisecs) {
	var i, finished;

	finished = false;

	for (i = 0; i < this.timeUnits.length; i++) {
	    if ( this.timeUnits[i].millisecs === millisecs ) {
		if (this.timeUnits[i].greaterNeighbor) {
		    this.timeUnits[i].greaterNeighbor.lesserNeighbor = this.timeUnits[i].lesserNeighbor;
		}
		if (this.timeUnits[i].lesserNeighbor) {
		    this.timeUnits[i].lesserNeighbor.greaterNeighbor = this.timeUnits[i].greaterNeighbor;
		    this.timeUnits[i].lesserNeighbor.maximum = this.timeUnits[i].maximum;
		} else {
		    //This unit is the last and therefore controls the timer
		    if (this.timeUnits[i].greaterNeighbor) {
			this.timer.onTick = dojo.hitch(this.timeUnits[i].greaterNeighbor, this.timeUnits[i].greaterNeighbor.decrement);
			this.timer.setInterval(this.timeUnits[i].greaterNeighbor.millisecs);
		    }
		}
		dojo.destroy(this.timeUnits[i].containerNode);
		this.timeUnits.splice(i, 1);
		this.calculateQuantities();
		return true;
	    }
	}
	return false;
    },

    /*  This function will need to be updated to do most of this work manually based
	on the TimeUnits this manager has to manage
    */
    calculateQuantities: function() {
	var date = new Date();
	var difference = dojo.date.difference(date, this.targetDate, "millisecond");
	var remainder = difference;
	
	dojo.forEach(this.timeUnits, function(timeUnit, i) {
	    timeUnit.setQuantity(remainder);
	    remainder = (remainder % timeUnit.millisecs);
	});
	
	console.log("Calculating Quantities");
    },

    reorderUnits: function() {
	var container = this.containerNode;
	console.log("reordering");
	dojo.forEach(this.timeUnits, function(timeUnit, i) {
	    if (timeUnit.greaterNeighbor) {
		dojo.place(timeUnit.containerNode, timeUnit.greaterNeighbor.containerNode, "after");
	    } else {
		//The greatest unit--first in the chain
		dojo.place(timeUnit.containerNode, container, "first");
	    }
	});
	
    }
});
