const express = require('express');
const user = require('./models/user.js');
const router = express.Router({ mergeParams: true });
const assert =  require('assert');
const User = require('./models/user.js');

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

module.exports = router;