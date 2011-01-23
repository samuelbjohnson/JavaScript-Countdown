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

dojo.provide("net.samuelbjohnson.jsdev.countdown.TimeUnitPalette");

dojo.require("dojo.dnd.Source");
dojo.require("net.samuelbjohnson.jsdev.countdown.TimeUnit");
dojo.require("net.samuelbjohnson.jsdev.countdown.TrashCan");

dojo.declare("net.samuelbjohnson.jsdev.countdown.TimeUnitPalette", null, {

    constructor: function(/*node*/ containerNode) {
	var units = new Array();
	this.paletteNode = dojo.create("div", {}, containerNode);
	//this.containerNode = containerNode;
	this.trashCan = new net.samuelbjohnson.jsdev.countdown.TrashCan(dojo.create("div", {}, containerNode));
	this.anchorNode = dojo.create("div", {class: "timePaletteLabel", innerHTML: "Available Time Units:"}, this.paletteNode);
	dojo.addClass(this.paletteNode, "timePaletteContainer");
	this.source = new dojo.dnd.Source(this.paletteNode, {
	    skipForm: true,
	    isSource: true,
	    copyOnly: true,
	    creator: dojo.hitch(this, this.createItem)
	});
	
	units[0] = new net.samuelbjohnson.jsdev.countdown.TimeUnit(1000, "Seconds", dojo.create("div"));
	units[1] = new net.samuelbjohnson.jsdev.countdown.TimeUnit(1000 * 60, "Minutes", dojo.create("div"));
	units[2] = new net.samuelbjohnson.jsdev.countdown.TimeUnit(1000 * 60 * 60, "Hours", dojo.create("div"));
	units[3] = new net.samuelbjohnson.jsdev.countdown.TimeUnit(1000 * 60 * 60 * 24, "Days", dojo.create("div"));
	units[4] = new net.samuelbjohnson.jsdev.countdown.TimeUnit(1000 * 60 * 60 * 24 * 7, "Weeks", dojo.create("div"));
	units[5] = new net.samuelbjohnson.jsdev.countdown.TimeUnit(100, "Deci-Seconds", dojo.create("div"));

	this.source.insertNodes(false, units, false, this.anchor);
	
    },

    createItem: function(item, hint) {
	var tempNode, newUnit;
	if (hint == "avatar") {
	    console.log("creating avatar");
	    tempNode = dojo.doc.createElement("div");
	    dojo.addClass(tempNode, "timeUnitAvatar");
	    return {
		node: tempNode,
		data: item,
		type: this.type
	    };
	} else {
	    console.log("returning non-avatar");
	    return {
		node: item.containerNode,
		data: item,
		type: this.type
	    };
	}
    }

});