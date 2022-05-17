const express = require('express');
const app = express();

/*
//For API documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'MoneyGenius API',
        description: 'API for managing personal finance and sharing common expenses.',
        version: '1.0.0',
    },
    servers:[
        {
            url: 'http://localhost:8080',
            description: 'Development server',
        }
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
*/
 
//Login and signup
const authentication = require("./authentication");
//Cheks validity of JWT
const tokenChecker = require("./tokenChecker");


const users = require('./users.js');

const addExpense = require("./addExpense.js");

//middleware for accessing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//basic user interface 
app.use('/', express.static('static'));

/**
* Authentication routing and middleware
*/
app.use('/api/v1/authentications/', authentication);
app.use('/api/v1/authentications/signup', authentication);
/**
 * 
 */

app.use(tokenChecker);

app.use('/api/v1/users', users);

app.use('/api/v1/users/*/expenses/', addExpense);

/*If no routs applyies, 404 error*/
app.use((req, res) =>{
    req.statusCode(404);
    res.json({error: 'Not found'});
});



module.exports = app;