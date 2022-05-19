const express = require('express');
const router = express.Router();

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

        //get the user id
        let id = req.body.id;
        console.log(id);

        //retrieve the user instance
        let user = await User.findOne({
            _id: id
        });

        //create the expense
        let expense={
            name: name,
            amount: amount,
            categoryId: categoryId,
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
            res.status(200).json({success: true});
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

    let id = req.query.id;

    //retrieve the user instance
    let user = await User.findOne({
		_id: req.query.id
	});

        
    var expenses = user.expenses;

    /*
        here i should clear the date and maybe remove the id from the response
        even sort them in order by the latest
        filter them by max limit
        show only last month? 
    */
    
        res.send(expenses);

    //})
    /*
    //if the user is not found
    .catch(error => {
        //write on console the error and send response with code and error message
        console.log(error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    });
    */
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