const express = require('express');
const app = express();

 
//Login and signup
const authentication = require("./authentication");
//Cheks validity of JWT
const tokenChecker = require("./tokenChecker");


const users = require('./users.js');

const expenses = require("./expense.js");

const budgets = require('./budgets.js');

const categories = require("./categories.js");

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

app.use('/api/v1/users/:id/categories', categories);

app.use('/api/v1/users/:id/expenses/', expenses);

app.use('/api/v1/users/:id/budget', budgets);

/*If no routs applyies, 404 error*/
app.use((req, res) =>{
    res.status(404).json({error: 'Not found'});
});



module.exports = app;