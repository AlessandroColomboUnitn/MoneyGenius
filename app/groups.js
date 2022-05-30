const express = require('express');
const router = express.Router();
const Group = require('./models/group'); //get our group model
const User = require('./models/user'); 
const jwt = require('jsonwebtoken');
const assert = require('assert');

router.post('', async function(req, res){

    let user_id = req.body.id;
    let group_name = req.body.name;

    try{
        assert(user_id && group_name, "Errore, paramatri mancanti");
        let group_exists = await Group.exists({name: group_name}).exec();
        let user = await User.findOne({_id: user_id}).exec();
        assert(!group_exists, "Errore, gruppo già esistente");
        assert(user, "Errore, utente non esistente");
        group = new Group({
            name: group_name,
            partecipants: [user_id],
        });
        
        group.save();

        user.group_id = group._id;
        
        user.save();
        
        //create a token
        var payload = {
            group_name: group.name,
            user_id: user_id,
            group_id: group._id
        }      
        
        var options = {
            expiresIn: 86400 // expires in 24 hours
        }
        
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        res.status(201).json({
            success: true,
            message: "Gruppo creato con successo",
            token: token
        })

    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * Parse a jwt token into a json object
 * source: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
 * @param {*} token 
 * @returns a json object containing all the fields encoded in the input token
 */
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

module.exports = router;