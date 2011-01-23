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

dojo.provide("net.samuelbjohnson.jsdev.countdown.CountdownTimer")

dojo.require("net.samuelbjohnson.jsdev.countdown.TimeUnit");
dojo.require("net.samuelbjohnson.jsdev.countdown.TimeUnitManager");
dojo.require("net.samuelbjohnson.jsdev.countdown.TargetDate");

dojo.declare("net.samuelbjohnson.jsdev.countdown.CountdownTimer", null, {
    constructor: function(/*node*/ parentNode) {
	this.targetDate = new Date(2011, 0, 30);
	this.parentNode = parentNode;
	this.buildDivStructure();
    },

    buildDivStructure: function() {
	var timerContainerNode;
	var targetDateContainerNode;
	var timer, targetDate;

	timerContainerNode = dojo.create("div", {
	    class: "timerContainer"
	}, this.parentNode);

	targetDateContainerNode = dojo.create("div", {
	    class: "timerTargetDateContainer",
	}, this.parentNode);

	targetDate = new net.samuelbjohnson.jsdev.countdown.TargetDate(targetDateContainerNode);

	timer = new net.samuelbjohnson.jsdev.countdown.TimeUnitManager(timerContainerNode, targetDate);
	timer.startTimer();


    }

});
