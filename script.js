'use strict';

angular.module('burnApp', ['angularUUID2'])
.controller('BurnController', function(TCollectionFactory, uuid2) {
    var vm = this;  
    var data = [{
            description: 'rent',
            amount: -1785,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'month',
        }, {
            description: 'starting amount',
            amount: 50000,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-04-30').toDate(),
            frequency: 'none',
        }, {
            description: 'salaries',
            amount: 0,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'biweek',
        }, {
            description: 'food',
            amount: -200,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'week',
        }, {
            description: 'school',
            amount: -1950,
            startDate: moment('2015-07-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'month',
        }, {
            description: 'insurance',
            amount: -200,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'month',
        }, {
            description: 'Car',
            amount: -400,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'month',
        }, {
            description: 'gas',
            amount: -50,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'month',
        }, {
            description: 'studen loans',
            amount: -500,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'month',
        }, {
            description: 'Mimirate funded salary',
            amount: 4800,
            startDate: moment('2015-09-01').toDate(),
            endDate: moment('2016-11-30').toDate(),
            frequency: 'month',
        }, {
            description: 'Salary',
            amount: 0,
            startDate: moment('2015-06-01').toDate(),
            endDate: moment('2015-09-01').toDate(),
            frequency: 'month',
        }, {
            description: 'Tessa School',
            amount: -624,
            startDate: moment('2015-05-01').toDate(),
            endDate: moment('2015-06-30').toDate(),
            frequency: 'month',
    }];

    vm.targetDate = moment('2015-05-02').toDate();
    vm.collection = new TCollectionFactory();
    data.forEach(function(d) {
        vm.collection.addTransaction(d);
    });

    vm.savedTransactions = _(localStorage)
            .keys().filter(function(k) {
            return k.match(/currentTransaction/);
        })
        .map(function(k) {
            if(localStorage.getItem(k)) {
                return {
                    k: k,
                    name: (function() {
                        var n = JSON.parse(localStorage.getItem(k)).name;
                        return !n ? '<No name>' : n;
                    }())
                };
            }
        })
        .filter(function(k) {
            return k;
        })
        .value();

    vm.newCollection = function() {
        vm.collection = new TCollectionFactory();
        vm.updateEverything(true);
    };

    vm.loadTransaction = function(series) {
        var stored = localStorage.getItem(series);
        var parsed;
        if (stored) {
            vm.collection = new TCollectionFactory();
            parsed = JSON.parse(stored);
            parsed.txns.forEach(function(s) {
                vm.collection.addTransaction({
                    description: s.description,
                    amount: s.amount,
                    startDate: moment(s.startDate).toDate(),
                    endDate: moment(s.endDate).toDate(),
                    frequency: s.frequency
                });
            });
            vm.collection.name = parsed.name;
            vm.collection.series = parsed.series;
            vm.updateEverything();
        }
    };

    vm.saveActive = false;

    vm.saveTransactions = function() {
        var series = vm.collection.series || uuid2.newuuid();
        if (!vm.collection.series) {
            vm.collection.series = series;
        }
        if(!localStorage.currentTransaction) {
            localStorage.setItem('currentTransaction', '');
        }
        localStorage.setItem(['currentTransaction', series].join('.'), JSON.stringify(vm.collection));
        vm.saveActive = false;
        vm.savedTransactions = _(localStorage)
                .keys().filter(function(k) {
                return k.match(/currentTransaction/);
            })
            .map(function(k) {
                if(localStorage.getItem(k)) {
                    return {
                        k: k,
                        name: (function() {
                            var n = JSON.parse(localStorage.getItem(k)).name;
                            return !n ? '<No name>' : n;
                        }())
                    };
                }
            })
            .filter(function(k) {
                return k;
            })
            .value();
    };

    vm.getSavedTransactions = function() {
        return vm.savedTransactions;
    };

    vm.deleteCollection = function() {
        localStorage.removeItem(['currentTransaction', vm.collection.series].join('.'));
        vm.savedTransactions = _(localStorage)
                .keys().filter(function(k) {
                return k.match(/currentTransaction/);
            })
            .map(function(k) {
                if(localStorage.getItem(k)) {
                    return {
                        k: k,
                        name: (function() {
                            var n = JSON.parse(localStorage.getItem(k)).name;
                            return !n ? '<No name>' : n;
                        }())
                    };
                }
            })
            .filter(function(k) {
                return k;
            })
            .value();
        vm.newCollection();
    };

    vm.removeTransaction = function(idx) {
        vm.collection.removeTransaction(idx);
        vm.updateEverything();
    };

    vm.resetForm = function() {
        vm.amount = null;
        vm.description = null;
        vm.startDate = null;
        vm.endDate = null;
        vm.frequency = null;
    };

    vm.addTransaction = function() {
        vm.collection.addTransaction({
            amount: vm.amount,
            description: vm.description,
            startDate: vm.startDate,
            endDate: vm.endDate,
            frequency: vm.frequency || 'none'
        });
        vm.resetForm();
        vm.updateEverything();
    };

    vm.updateValue = function() {
        vm.valueOnDate = vm.collection.valueOnDate(vm.targetDate);
    };


    vm.drawLine = function(pathData) {
            var pathFunction = d3.svg.line()
                                .x(function(d) { return xScale(d.x);})
                                .y(function(d) { return yScale(d.y);})
                                .interpolate('cardinal');
            var xScale = d3.scale.linear()
                            .domain([0, d3.max(pathData, function(d) { return d.x; })])
                            .range([0, 290]);

            var yScale = d3.scale.linear()
                            .domain([0, d3.max(pathData, function(d) { return d.y; })])
                            .range([200, 0]);
            var xAxis = d3.svg.axis().scale(xScale).ticks(4);
            var yAxis = d3.svg.axis().scale(yScale).orient('left');
        if (!vm.svg) {
            vm.svg = d3.select('.burn-chart').append('svg')
                        .attr('background', 'linen')
                        .attr('width', '100%')
                        .attr('height', '100%');

            var path = vm.svg.append('path')  //jshint ignore:line
                        .attr('d', pathFunction(pathData))
                        .attr('stroke', 'steelblue')
                        .attr('stroke-width', 1)
                        .attr('fill', 'none');

            var nowLine = vm.svg.append('line') //jshint ignore:line
                        .attr('x1', xScale(moment().diff(moment(vm.collection.getBoundaryDates().startDate))))
                        .attr('y1', 0)
                        .attr('x2', xScale(moment().diff(moment(vm.collection.getBoundaryDates().startDate))))
                        .attr('y1', 200)
                        .attr('class', 'axis');

            vm.svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0, 200)')
                .call(xAxis);

            vm.svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        } else {
            vm.svg.selectAll('path')
                .attr('d', pathFunction(pathData))
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 1)
                .attr('fill', 'none');
            vm.svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0, 200)')
                .call(xAxis);

            vm.svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        }
    };

    vm.updateEverything = function(init) {
        var pathData = vm.collection.generatePath('month');
        vm.minValue = d3.min(pathData, function(d) { return d.y; });
        vm.endValue = pathData[pathData.length - 1].y;
        vm.drawLine(pathData);
        vm.updateValue();
        if(!init) {
            vm.saveActive = true;
        }
    };
    vm.updateEverything(true);
    
})
.factory('TCollectionFactory', function(TransactionFactory) {
    var TCollection = function(blob) {
        this.txns = [];
        if (blob) {
            if (blob.constructor === Array) {
                blob.forEach(function(t) {
                    this.addTransaction(t);
                });
            }
        }
    };

    TCollection.prototype.removeTransaction = function(idx) {
        this.txns.splice(idx, 1);
    };

    TCollection.prototype.addTransaction = function(txn) {
        var self = this;
        var newTxn;
        if(txn.constructor !== TransactionFactory) {
            newTxn = new TransactionFactory(txn);
        } else {
            newTxn = txn;
        }
        self.txns.push(newTxn);
    };

    TCollection.prototype.generatePath = function(res) {
        if (!res) { res = 'days'; } //default resolution is weeks
        var self = this;
        var bounds = this.getBoundaryDates();
        var start = moment(bounds.startDate);
        var domain = moment.range(bounds.startDate, bounds.endDate);
        var domainAcc = [];
        domain.by(res, function(m) {
            domainAcc.push({
                x: m.diff(start, 'days'),
                y: self.valueOnDate(m.toDate())
            });
        });
        return domainAcc;
    };

    TCollection.prototype.getMinimumValue = function() {
        var path = this.generatePath('days');
        var min;
        path.forEach(function(p) {
            if(!min) {
                min = p.y;
            } else {
                if(p.y < min) {
                    min = p.y;
                }
            }
        });
        return min;
    };

    TCollection.prototype.getEndValue = function() {
        return this.valueOnDate(this.getBoundaryDates().endDate);
    };

    TCollection.prototype.getBoundaryDates = function() {
        var acc = [];
        var startDate;
        var endDate;
        _.each(this.txns, function(t) {
            var transactions = t.gatherTransactions();
            acc = acc.concat(transactions);
        });
        acc.forEach(function(t) {
            if(!startDate) {
                startDate = t.startDate;
            } else {
                if (t.startDate < startDate) {
                    startDate = t.startDate;
                }
            }
            if(!endDate) {
                endDate = t.startDate;
            } else {
                if (t.startDate > endDate) {
                    endDate = t.startDate;
                }
            }
        });
        return {
            startDate: startDate,
            endDate: endDate
        };
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

    //Probably a better way to do this...
    TCollection.prototype.getDeathDate = function() {
        
    };

    return TCollection;
})
.factory('TransactionFactory', function(uuid2) {

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
        var series = uuid2.newuuid();

        if(['none', 'month', 'week', 'biweek', 'day'].indexOf(txn.frequency) === -1) {
            throw new Error('Frequency must be none, day, week, biweek, or month.');
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
        } else {
            return txn; //none case
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

    return Transaction;
});
