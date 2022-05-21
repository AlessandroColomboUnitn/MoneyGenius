const express = require('express');
const router = express.Router({ mergeParams: true }); //{ mergeParams: true } to access params in the route of app.js

const User = require('./models/user'); // get our mongoose model



//API for recording an expense
//API endpoint: api/v1/users/:id/expenses
router.post('', async function(req, res){

    //get the value of the form submitted
    let name = req.body.name;
    let amount = req.body.amount;
    let categoryId = req.body.categoryId;
    let date = req.body.date;
    
    //check if the inputs are valid
    if(validateInputs(name, amount, categoryId, date)){

        //get the id from the request url
        let id = req.params.id;

        //retrieve the user instance
        let user = await User.findOne({
            _id: id
        }).exec();

        //create the expense
        let expense={
            name: name,
            categoryId: categoryId,
            amount: amount,
            date: date
        };

        //push on the array of expenses
        user.expenses.push(expense);

        //saving the changes on the db
        await user.save()
        //if the document is saved correctly
        .then(updatedUser =>{
            // updatedUser === user; //true
            /*  
                from the api slides:
                The response of a POST request should provide an empty body
                and an HTTP header'Location' with a link to the newly created resource. 
            

                res.location("/api/v1/users/:id/expenses/:id").status(201).send();
            */
            
            res.status(201).json({
                success: true,
                expense: expense
            });
        })
        //if there is an error with the db
        .catch(error => {
            //write on console the error and send response with code and error message
            console.log(error);
            res.status(500).json({success: false, message: "Internal Server Error"});
        });

    }else{
        res.status(400).json({success: false, message: "Input non valido"});
    }
    
});


//API for retrieving all the expenses of a user
//API endpoint: api/v1/users/:id/expenses
router.get('', async function(req, res) {
    
    //get the id from the request url
    let id = req.params.id;

    //retrieve the user instance
    var user = await User.findOne({
		_id: id
	}).exec();

    if(!user){
        res.status(400).json({ success: false, message: 'Utente non trovato' });
        return;
    }
  
    var expenses = user.expenses;

    /*
        clear the date
        remove the id 
        sort them by date in decrescent order
        filter them by max limit
        show only last month
    */
    
    res.status(200).json({
        success: true,
        message: 'Here are your expenses!',
        expenses: expenses,
    });

});


function validateInputs(name, amount, categoryId, date){
    return (
        name!="" &&
        (!isNaN(amount) && amount > 0) &&
        categoryId !="" /*&&
        date*/
    );
}

module.exports = router;