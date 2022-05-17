const express = require('express');
const app = express();

const authentication = require("./authentication");
const tokenChecker = require("./tokenChecker");

const users = require('./users.js');

const addExpense = require("./addExpense.js");

//middleware for accessing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//serving static files from the static folder
app.use('/', express.static('static'));

/**
* Authentication routing and middleware
*/
app.use('/api/v1/authentications', authentication);
app.use('/api/v1/authentications/signup', authentication);
/**
 * 
 */
app.use('/api/v1/users', users);



app.use('/api/v1/users/*/expenses/', addExpense);






/*If no routes applyies, 404 error*/
app.use((req, res) =>{
    res.status(404);
    res.json({error: 'Not found'});
});

module.exports = app;