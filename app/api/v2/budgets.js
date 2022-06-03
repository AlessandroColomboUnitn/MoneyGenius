const express = require('express');
const user = require('../../models/user.js');
const router = express.Router({ mergeParams: true });
const assert =  require('assert');
const User = require('../../models/user.js');
const { isValidObjectId } = require('mongoose');

//const expenses = require('./models/addExpense');

/*router.get('/me', async (req, res)=>{
    if(!req.loggedUser) return;
});*/

router.get('', async(req, res) => {
    
    let id = req.params.id;

    var user = await User.findById(id);
    
    assert(user, "utente non identificato");

    let total_spent = user.budget_spent;
    let budget = user.budget - total_spent;

    await user.save();
    res.status(200).json({success: true, total_spent: total_spent, budget: budget});

});

router.post('', async (req,res) => {
    
    let budget = req.body.budget; 
    let id = req.params.id;
    /* 
     * take from the form the value of budget
     * check if the budget has a correct value
     * check if the user exists in the DB
     * then it set the value in the DB as budget
    */
    try{
        assert(!isNaN(budget) && budget > 0 && id, "input non valido");
        assert(isValidObjectId(id), "Errore, l'id specificato non è valido");
        let user = await User.findById(id);
        assert(user, "Errore, l'utente specificato non esiste");
        user.budget = budget;
        await user.save();
        res.status(201).json({success: true});
    }catch(err){
        res.status(400).json({success: false, message: err.message});
    }
} );

module.exports = router;