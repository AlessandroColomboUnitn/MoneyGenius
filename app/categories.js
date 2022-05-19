const express = require('express');
const router = express.Router();
const User = require('./models/user');
const assert = require('assert');

/**
 * Create a new category
*/

router.post('/', async function(req, res){
    
    let email = req.body.email; //user's email
    let name = req.body.name; //category's name
    let color = req.body.color; //category's color
    let budget = req.body.budget; //category's budget
    
    //console.log(name+" "+color+" "+budget);

    try{

        assert(name && color && budget, "Creazione fallita, parametri mancanti."); //check that no parameters are missing
        
        let user = await User.findOne({email: email}).exec();
        
        assert(!user.categories.find( x => x.name === name), "Creazione fallita, categoria già esistente."); //check that the category does not exists already

        assert(!user.categories.find( x => x.color === color), "Creazione fallita, colore categoria già assegnato."); //check that the color is not already assigned to another categoty
        
        assert(new_alloc_budget > user.budget, "Creazione fallita, il budget allocato per le categorie supera il budget totale."); //check that the sum of budgets of all categories does not exceed the user's budget

        let new_alloc_budget = user.allocated_budget+budget;

        user.allocated_budget = new_alloc_budget; //update sum of budget allocated for all categories

        await user.categories.push({name: name, color: color, budget: budget}); //add new category
    
        user = await user.save(); 
    
        let free_budget = user.budget - new_alloc_budget; //budget not yet allocated to any category

        res.status(200).json({
            success: true,
            message: "Creazione riuscita.",
            free_budget: free_budget
        });

    }catch(error){ //if one of the above assertions fails, we return the respective error message
        res.status(400).json({
            success: false,
            message: error.message
        });
    }

});

module.exports = router;