'use strict';
var moment = require('moment');
require('moment-range');

var d1 = moment('2014-01-01');
var d2 = moment('2014-03-01');
var d3 = moment('2014-01-01').add(2, 'weeks'); 
var range2 = moment().range(d1, d3);
var range3 = moment().range(2, 'weeks');
console.log(range3);
var range = moment().range(d1, d2);
var acc = [];

range.by(range2, function(moment) {
    console.log(moment.format());
    acc.push(moment);
});

console.log(acc.length);
