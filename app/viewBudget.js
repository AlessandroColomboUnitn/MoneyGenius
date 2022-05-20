const express = require('express');
const router = express.Router({ mergeParams: true });

const User = require('./models/user.js');

//const expenses = require('./models/addExpense');

/*router.get('/me', async (req, res)=>{
    if(!req.loggedUser) return;
});*/

router.get('/viewBudget', async(req, res) => {
    
    let email = req.body.email;
    let user = await User.findOne({email: email});
    let total_spent;
    if(user.budget_spent === null){
        total_spent = 0;
    }
    
    user.budget_spent = total_spent;
    await user.save();
    res.status(200).json({success: true, total_spent: total_spent});

});

module.exports = router;