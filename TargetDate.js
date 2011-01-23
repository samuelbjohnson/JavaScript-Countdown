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

dojo.provide("net.samuelbjohnson.jsdev.countdown.TargetDate");

dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TimeTextBox");

dojo.declare("net.samuelbjohnson.jsdev.countdown.TargetDate", null, {
    constructor: function(/*node*/containerNode) {
	var date = new Date(2011, 1, 18);
	this.containerNode = containerNode;

	this.getDate = function() {
	    return date;
	};
	this.setDate = function(/*date*/ newDate) {
	    date = newDate;
	    this.dateNode.innerHTML = newDate;
	};

	this.buildHtml();
	this.setupConnections();
    },

    buildHtml: function() {
	dojo.addClass(this.containerNode, "timerTargetDateContainer");
	this.labelNode = dojo.create("div", {class: "timerTargetDateLabel"}, this.containerNode);
	this.labelNode.innerHTML = "Counting Down To:";
	this.formNode = dojo.create("div", {class: "timerTargetDateForm"}, this.containerNode);
	this.dateField = new dijit.form.DateTextBox({
	
	}, dojo.create("div", {}, this.formNode));
	this.timeField = new dijit.form.TimeTextBox({
	
	}, dojo.create("div", {}, this.formNode));

	this.dateNode = dojo.create("div", {class: "timerTargetDateDate"}, this.containerNode);
	this.dateNode.innerHTML = this.getDate();
    },

    setupConnections: function() {
	dojo.connect(this.dateField, "onChange", this, this.onChange);
	dojo.connect(this.timeField, "onChange", this, this.onChange);
    },

    onChange: function() {
	var day, time, tempDate;
	console.log('change registered');
	
	day = this.dateField.value;
	time = this.timeField.value;
	tempDate = this.getDate();
	if (day) {
	    tempDate = new Date(day);
	}
	if (time) {
	    tempDate.setHours(time.getHours());
	    tempDate.setMinutes(time.getMinutes());
	    tempDate.setSeconds(time.getSeconds());
	} else {
	    tempDate.setHours(this.getDate().getHours());
	    tempDate.setMinutes(this.getDate().getMinutes());
	    tempDate.setSeconds(this.getDate().getSeconds());
	}
	this.setDate(tempDate);
    }
});