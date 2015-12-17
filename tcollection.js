'use strict';

require('moment-range');
var _ = require('lodash');
var moment = require('moment');
var uuid = require('node-uuid');

var Transaction = function(blob) {
    this.description = blob.description || null;
    this.parentTransaction = null;
    this.children = [];
    this.amount = blob.amount || null;
    this.startDate = blob.startDate || null;
    this.endDate = blob.endDate || null;
    this.frequency = blob.frequency || 'none'; 
    this.series = null;
    this.accumulator = []; //use this to send txns up the tree.
};

Transaction.prototype.addChild = function(blob) {
    var newChild = new Transaction(blob);
    newChild.parentTransaction = this;
    this.children.push(newChild);
    this.setAmount();
};

Transaction.prototype.setAmount = function(amount) {
    if (this.children.length > 0) {
        this.amount = _.sum(this.children, function(c) {
            return c.getAmount();
        });
    } else {
        this.amount = amount;
    }
    if (this.parent) {
        this.parent.setAmount();
    }
};

Transaction.prototype.getAmount = function() {
    if (this.children.lenght > 0) {
        this.amount = _.sum(this.children, function(c) {
            return c.getAmount();
        });
    } else {
        return this.amount;
    }
};

Transaction.prototype.removeChild = function(childIdx) {
    this.children.splice(childIdx, 1);
};

Transaction.prototype.gatherTransactions = function() {
    //Leaf case
    if (this.children.length === 0 && this.parentTransaction !== null) {
        this.parentTransaction.accumulator = this.parentTransaction.accumulator.concat(this.initRepeatTransactions(this));
    //Branch case
    } else if (this.parentTransaction !== null) {
        this.children.forEach(function(c) {
            c.gatherTransactions();
        });
        this.parentTransaction.accumulator = this.parentTransaction.accumulator.concat(this.initRepeatTransactions(this));
        this.accumulator = [];
    //Root case
    } else if (this.parentTransaction === null && this.children.length > 0) {
        this.accumulator = [];
        this.children.forEach(function(c) {
            c.gatherTransactions();
        });
        return this.accumulator;
    //Floater case
    } else if (this.parentTransaction === null && this.children.length === 0) {
        return this.initRepeatTransactions(this);
    }
};

Transaction.prototype.initRepeatTransactions = function(txn) {
    var acc = [];
    var start = moment(txn.startDate);
    var end = moment(txn.endDate);
    var range;
    var series = uuid.v1();

    if(['month', 'week', 'biweek', 'day'].indexOf(txn.frequency) === -1) {
        throw new Error('Frequency must be day, week, biweek, or month.');
    }
    if(txn.frequency === 'month') {
        moment().range(start, end).by('months', function(moment) {
            acc.push(moment);
        });
    } else if (txn.frequency === 'week') {
        moment().range(start, end).by('weeks', function(moment) {
            acc.push(moment);
        });
    } else if (txn.frequency === 'biweek') {
        range = moment().range(start, start.clone().add(2, 'weeks'));
        moment().range(start, end).by(range, function(moment) {
            acc.push(moment);
        });
    } else if (txn.frequency === 'day') {
        range = moment().range(start, end).by('days', function(moment) {
            acc.push(moment);
        });
    }
    return _.map(acc, function(m) {
        var t = _.clone(txn);
        t.startDate = m.toDate();
        t.endDate = null;
        t.frequency = 'none';
        t.series = series;
        return t;
    });
};

var TCollection = function(blob) {
    var self = this;
    self.txns = [];
    if (blob) {
        if (blob.constructor === Array) {
            blob.forEach(function(t) {
                self.addTransaction(t);
            });
        }
    }
};

TCollection.prototype.addTransaction = function(txn) {
    var self = this;
    var newTxn;
    if(txn.constructor !== Transaction) {
        newTxn = new Transaction(txn);
    } else {
        newTxn = txn;
    }
    if(newTxn.frequency !== 'none') {
        this.initRepeatTransactions(newTxn).forEach(function(t) {
            self.txns.push(t);
        });
    } else {
        self.txns.push(newTxn);
    }
};

TCollection.prototype.valueOnDate = function(date) {
    var acc = [];
    _.each(this.txns, function(t) {
        var transactions = t.gatherTransactions();
        acc = acc.concat(transactions);
    });

    var filteredTxns = _.filter(acc, function(t) {
        return t.startDate <= date;
    });

    var value = _.sum(filteredTxns, function(t) {
        return t.amount;
    });
    return value;
}; 

module.exports = TCollection;
