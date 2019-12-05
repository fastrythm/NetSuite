/**
 * This code provides an example on how code completion works for the search filter expression.
 */

function searchFilterExpressionExample1() {
    //Demonstrate code completion for search filter expression using create search

    //#1 you can code complete search filter expressions if you are using array literals
    //   (other forms of array declaration are not supported in code completion)
    //   in this example, the array literal is passed directly in the function
    nlapiCreateSearch('opportunity', [ ['amount', 'is', 1000 ], 'and', ['class', 'is', '@none@']]);

    //#2 you can also code complete via a variable if that variable has been passed into the function
    //   note that this does not work if you have not typed in line 16
    var expression = [ ['balance', 'greaterthan', 1000 ], 'and', ['class', 'is', '@none@']];
    nlapiCreateSearch('account', expression);

    //#3 when using a join in search filter expression, you can select a join record first then type in a period and then select the joined field
    //   in the example, select salesrep, type in the period "." after salesrep and press ctrl space to list fields from salesrep
    var expression2 = [ ['salesrep.email', 'isnotempty' ] ];
    nlapiCreateSearch('salesorder', expression2);
}

function searchFilterExpressionExample2() {
    //Demonstrate how code completion for search filter expression works for load search
    var s = nlapiLoadSearch('salesorder', 1);

    //all these functions support field code completion also
    s.addColumn(new nlobjSearchColumn('cashflowratetype', 'account', ''));
    s.addColumns([new nlobjSearchColumn('abbrev', '', '')]);
    s.addFilter(new nlobjSearchFilter('account', null, 'anyof', [ 1, 2, 3]));
    s.addFilters([new nlobjSearchFilter('account', null, '')]);

    //#1 you can code complete every thing in the array literal that is directly passed to the method setFilterExpression
    s.setFilterExpression([['balance','lessthan', 5000], 'and', 'not', ['salesrep', 'is', -5] ]);

    //#2 variable "expression" is recognized when it has been passed to s.setFilterExpression function
    //   and you can code complete any string literal on line 33
    var expression = [['amount','greaterthan',0], 'and', [['accounttype','is','1'],'or',['accounttype','is','2']]];
    s.setFilterExpression(expression);
}
