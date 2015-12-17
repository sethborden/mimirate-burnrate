'use strict';

var TCollection = require('./tcollection.js');
var moment = require('moment');
var assert = require('assert');

function test() { //jshint ignore:line
    //Create a new collection
    return new TCollection([
        {
            amount: -1785,
            description: 'rent',
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-04-30').toDate(),
            frequency: 'month' 
        },
        {
            amount: 250000,
            description: 'starting investment',
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-04-30').toDate(),
            frequency: 'none' 
        },
        {
            amount: -2500,
            description: 'salaries',
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-04-30').toDate(),
            frequency: 'biweek' 
        },
        {
            amount: -200,
            description: 'team lunch',
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-04-30').toDate(),
            frequency: 'day' 
        },
        {
            amount: -360,
            description: 'parking for team',
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-04-30').toDate(),
            frequency: 'week' 
        },
        {
            amount: -200,
            description: 'insurance',
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-04-30').toDate(),
            frequency: 'month' 
        }
    ]);
}


function test2() {
    var collection = new TCollection([{
        amount: null,
        description: 'expenses',
        startDate: Date.now(),
        endDate: null,
        frequency: 'none'
    }]);
    collection.txns[0].addChild({
        amount: null,
        description: 'employees',
        startDate: moment('2015-05-01').toDate(),
        endDate: moment('2016-04-30').toDate(),
        frequency: 'month'
    });
    collection.txns[0].children[0].addChild({
        amount: -2500,
        description: 'jackie',
        startDate: moment('2015-05-01').toDate(),
        endDate: moment('2016-04-30').toDate(),
        frequency: 'month'
    });
    collection.txns[0].children[0].addChild({
        amount: -2500,
        description: 'seth',
        startDate: moment('2015-05-01').toDate(),
        endDate: moment('2016-04-30').toDate(),
        frequency: 'month'
    });
    collection.txns[0].addChild({
        amount: -200,
        description: 'parking',
        startDate: moment('2015-05-01').toDate(),
        endDate: moment('2016-04-30').toDate(),
        frequency: 'week'
    });
    return collection;
}

var generateCSV = function(collection) { //jshint ignore:line
    //Generate the range for burnrate
    var domain = moment.range(moment('2015-05-01'), moment('2016-04-30'));
    var domainAcc = [];
    domain.by('weeks', function(m) {
        domainAcc.push({
            date: m.format('YYYY-MM-DD'),
            value: collection.valueOnDate(m.toDate())
        });
    });
    domainAcc.forEach(function(m) {
        console.log(m.date + ',' + m.value);
    });
};

var val = test2().valueOnDate(moment('2015-05-23').toDate());
assert.deepEqual(val, -5800);
