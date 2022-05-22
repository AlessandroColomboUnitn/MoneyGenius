const assert = require('assert');
const express = require('express');
const router = express.Router({ mergeParams: true }); //{ mergeParams: true } to access params in the route of app.js

const User = require('./models/user'); // get our mongoose model


//API for recording an expense
//API endpoint: api/v1/users/:id/expenses
router.post('', async function(req, res){

    //get the value of the form submitted
    let name = req.body.name;
    let amount = + req.body.amount; //cast to number
    let categoryId = req.body.categoryId;
    let date = req.body.date;
    
    try{
        //check the inputs
        assert(validateInputs(), "Creazione fallita, input non validi.");
        
        //get the id from the request url
        let id = req.params.id;

        //retrieve the user instance
        let user = await User.findOne({_id: id}).exec();
        assert(user, "Creazione fallita, utente non riconosciuto.");

        //create the expense
        let expense={
            name: name,
            categoryId: categoryId,
            amount: amount,
            date: date
        };

        //push on the expenses array
        await user.expenses.push(expense);

        //update budget left
        user.allocated_budget+=expense.amount;

        //update budget spent
        user.budget_spent+=expense.amount;

        console.log(categoryId);

        //get the category
        let category = user.categories.find(cat => cat.id == expense.categoryId);

        //update budget left x catgory
        
        //update budget spent x catgory

        user = await user.save(); 

        //modify expense to send the category name
        expense.categoryId = category.name;
    
        res.status(201).json({
            success: true,
            message: "Nuova spesa registrata.",
            expense: expense,
            //budget: user.budget,
            //budget_spent: user.budget_spent
        });

    }catch(error){ //if one of the above assertions fails, we return the respective error message
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


//API for retrieving all the expenses of a user
//API endpoint: api/v1/users/:id/expenses
router.get('', async function(req, res) {
    
    //get the user id from the request url
    let id = req.params.id;

    try{
        //retrieve the user instance
        var user = await User.findById(id).exec();

        assert(user, "Utente non riconosciuto.");

        //shallow copy to avoid updates on db
        var expenses = [...user.expenses];
        var categories = user.categories;

        if(expenses.length !== 0){ 
            //TODO find a better solution to
            expenses.forEach(expense => {
                let cat = categories.find(cat => cat.id === expense.categoryId);
                assert(cat, 'Categoria non esistente.');
                expense.categoryId = cat.name;
            });
        }


        res.status(200).json({
            success: true,
            message: 'Ecco le tue spese.',
            expenses: expenses
        });

    }
    catch(error){
        res.status(400).json({ success: false, message: error.message });
        console.log(error);
    }
    /*
        clear the date
        remove the id 
        sort them by date in decrescent order
        filter them by max limit
        show only last month
    */
});


function validateInputs(name, amount, categoryId, date){
    return (
        name!="" &&
        (!isNaN(amount) && amount > 0) &&
        categoryId !="" /*&&
        date*/

    ) || true;
}

module.exports = router;