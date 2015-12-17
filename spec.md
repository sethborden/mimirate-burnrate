Landing Page ------

The user will access a landing page with a log in space and option to create a
new account.

The user will either log in to an existing account or create a new account

A user who logs in will be redirected to the burn rate calculator page

New Account -----

The user will provide a username, first name, last name, password, and company

The password will be entered twice

The user's email address shall be unique in the system

The user's username shall be unique in the system

Upon successfully completing the sign up for, the user shall be redirected to
the burn rate calculator page.

Burn Rate Calculator ----

A user shall be able to create a new transaction with the following properties:

    -Description
    -Start Date
    -End Date
    -Amount 
    -Frequency
    -Growth Rate

Any transaction without a set end date shall repeat through the end of the
examination period (see below).

Any transaction with no frequency associated with it shall be treated as a one
time transaction and shall not be included in calculation of
(weekly|monthly|daily) burn rates.

Upon creation of a new transaction, the transaction shall be added to a
transaction table, which will show all transaction objects in a given
transaction collection.  

Transaction Collection ---

The transaction collection shall be composed of transaction objects.

The transaction collection shall only contain on object per transaction, even in
cases where the transaction repeats.

The value of all transactions of a given date shall be exposed by calling a
specific method of the collection object.

Transaction Table ---

The transaction table shall allow the user to sort transactions by amount,
description, frequency, start date, end date, or growth rate.

Transactions within the table shall be rearrangeable.

Results ---

Results for a specific timeframe shall be displayed in graphic form with a
defaul frequency of weeks, where the start date shall be the start date of the
earliest transaction in the transaction collection and the end date shall be the
end date of the latest date in the transaction.

Both the start date and end date may be defined by the user.

The period for which a graphical summary is provided shall be called the
examination period for the collection.

On mouse-ing over the graphical representation of the users burn rate, the
selected date and value of all transactions on that date shall be displayed.

Any local minima or maxima (i.e., inflection points) on the chart of burn rates
shall be highlighted with a colored dot.

Any period for which the total value of all transactions falls below zero shall
be marked with a dot.

Any period for which the total value of all transactions rises above zero shall
be marked with a dot.

Summary results of the examination period shall include:

    -Start Date
    -End Date
    -Total income
    -Total expenses
    -Minimum transaction balance
    -Maximum transaction balance
    -Average 'burn rate' for the period

Save/Load features --

Users shall be able to save transactions to a cloud server or to a local file.

Users shall be able to load transactions from a cloud server ora  local file.


NOTES from Jackie (5/12/2015)

    --OVERALL HELP SYSTEM via overlay
    --Label it as a burn rate/cash flow calculator
    --Way to view repeat txns as a separate chart (so 100 at 10%/month shows as
    100, 110, 122, 134, etc.)

