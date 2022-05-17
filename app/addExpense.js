const express = require('express');
const router = express.Router();

const User = require('./models/user'); // get our mongoose model
//const Expense = require('./models/expense'); // get our mongoose model
//expense.js not needed


//API endpoint: /api/v1/expenses
//or better: api/v1/users/:id/expenses

//API for recording an expense
router.post('', async function(req, res) {
	
    //how do i recognize wich user?
    //is it in the URL or with the token?


    //get the expense data from the expense form
    //and create the object
    /*let expense = new Expense({
        name: req.body.name,
        amount: req.body.amount,
        categoryId: req.body.categoryId
        //,date:req.body.date
    });*/


    //save the new expense into the user's expenses
    //here i take the first user in the collection
    var user = await User.findOne();
    var expense={
        name: req.body.name,
        amount: req.body.amount,
        categoryId: req.body.categoryId
        //,date:req.body.date
    };
    user.expenses.push(expense);

    await user.save();


 /*   
    The response of a POST request should provide an empty body
    and an HTTP header'Location' with a link to the newly created resource. 
 */

    //res.json({ user: 'tobi' });
    //res.redirect(201, "/home.html");
    //res.location("/api/v1/users/"+ id).status(201).send();
    res.location("/home.html").status(201).send();
    
});


//api for getting all the expenses of a user
router.get('', async function(req, res) {

    // read users from mongodb and sensd back
    const user = await User.findOne();
    //console.log(user.expenses);
    res.send(user.expenses);

    // read only the expenses of a user

});


module.exports = router;