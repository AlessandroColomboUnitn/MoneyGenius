const express = require('express');
const app = express();

 
//Login and signup
const authentication = require("./authentication");
//Cheks validity of JWT
const tokenChecker = require("./tokenChecker");


const users = require('./users.js');

const addExpense = require("./addExpense.js");

//const viewBudget = require('./viewBudget');
const categories = require("./categories");

//middleware for accessing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//basic user interface 
app.use('/', express.static('static'));

/**
* Authentication routing and middleware
*/
app.use('/api/v1/authentications', authentication);
/**
 * 
 */

app.use(tokenChecker);

app.use('/api/v1/users', users);

app.use('/api/v1/users/:id/categories', categories)

app.use('/api/v1/users/*/expenses/', addExpense);

//app.use('/api/v1/users/*/budget_spent/', viewBudget);

/*If no routs applyies, 404 error*/
app.use((req, res) =>{
    res.status(404).json({error: 'Not found'});
});



module.exports = app;