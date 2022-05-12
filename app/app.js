const express = require('express');
const app = express();

const authentication = require("./authentication")
const tokenChecker = require("./tokenChecker")

const students = require('./users.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/', express.static('static'));

/**
* Authentication routing and middleware
*/
app.use('/api/v1/authentications', authentication);

/*If no routs applyies, 404 error*/
app.use((req, res) =>{
    req.statusCode(404);
    res.json({error: 'Not found'});
});

module.exports = app;