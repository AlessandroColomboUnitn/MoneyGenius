const express = require('express');
const app = express();

 
//Login and signup
const authentication = require("./authentication");
//Cheks validity of JWT
const tokenChecker = require("./tokenChecker");


const users = require('./users.js');

const expenses = require("./api/v2/expenses.js");

const budgets = require('./budgets.js');

const categories = require("./categories.js");

const groups = require("./groups")

const invitations = require("./invitations");

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

//app.use('/api/v1/users/:id/expenses/', expenses);
app.use('/api/v2/users/:id/expenses/', expenses);

app.use('/api/v1/users/:id/budget', budgets);

app.use('/api/v2/groups', groups);

app.use('/api/v2/groups/:id/invitations', invitations);

/*If no routs applyies, 404 error*/
app.use((req, res) =>{
    res.status(404).json({error: 'Page not found'});
});



module.exports = app;