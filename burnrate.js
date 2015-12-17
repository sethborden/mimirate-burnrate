'use strict';
//First we need to know how much money we have to start with
//
var CONST = (function(){
    this.retMatch = 0.05;
    this.insurance = 0.5;
    this.fica = 0.0765;
    this.ficaMaxSalary = 118500;
    this.unemploymentInsurance = 0.034;
}());

var cashOnHand = Number();
var employees = [];
var offices = [];

var Employee = function() {
    this.startMonth = Number();
    this.endMonth = Number();
    this.salary = Number(); //What you be paying this employee
    this.retirement = this.salary * CONST.retMatch; //Assumes you match 5% of 401k contributions
    this.insurance = this.insurance * CONST.insurance; //Assumes you cover 50% of premiums
    this.taxes = (function() { //employer portion of FICA and Medicare taxes
        if (this.salary < CONST.ficaMaxSalary) {
            return this.salary * CONST.fica;
        } else {
            return CONST.ficaMaxSalary * CONST.fica;
        }
    }()); //FICA and medicare
    this.unemployment = this.salary * 0.034; //unemployment insurance paid to state
    this.otherBenefits = Number(); //to include parking, commuting, etc.
    this.equipment = [
            {
                description: String(),
                cost: Number(),
                month: Number() //should default to the month the employee is added
            }
        ]; //One time spend on employee computer equipment
    return this;
};

//TODO need to make pro-rating for endMonth employees work
Employee.prototype.monthlyCost = function(month) {
    var cost = function() {
       var res = this.salary + this.retirement + this.insurance + this.taxes + this.unemployment;
       var equipment = _(equipment).filter()
    }
    if (this.startMonth <= month && this.endMonth > month) { //make sure they're currently working
        
    } else if (this.startMonth - month < 1 && this.startMonth > 0) { //they're in a prorated start month

    } 
};

var Office = function() {
    this.startMonth = Number();
    this.endMonth = Number();
    this.rent = Number();
    this.electricity = Number();
    this.gas = Number();
    this.phone = Number(); //include all phones in here, unless you include employee cell phones in other above
    this.internet = Number(); //'cause you're going to need internet access
    this.supplies = Number(); //paper, pens, pencils, etc.  DO NOT INCLUDE IT SPENDING HERE
    return this;
};

var MonthCost = function() {
     
};
