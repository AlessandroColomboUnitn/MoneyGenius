const express = require('express');
const router = express.Router();

const User = require('./models/user'); // get our mongoose model
const user = require('./models/user'); // a cosa serve, non è doppia?

//API endpoint: /api/v1/expenses
// or better: api/v1/users/:id/expenses

//API for recording an expense
router.post('', async function(req, res) {
	
    //how do i recognize wich user?

    //get the expense data from the expense form

    //contact the db and store the new expense

    //send back a response with the outcome

});

module.exports = router;