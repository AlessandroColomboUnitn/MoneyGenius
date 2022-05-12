const express = require('express');
const router = express.Router();
const User = require('./models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// ---------------------------------------------------------
// Based on source: https://github.com/unitn-software-engineering/EasyLib/blob/master/app/authentications
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {
	
	// find the user
	let user = await User.findOne({
		email: req.body.email
	}).exec();
	
	// user not found
	if (!user) {
		res.json({ success: false, message: 'Authentication failed. User not found.' });
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	}
	
	// if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		self: "api/v1/" + user._id
	});

});

// ---------------------------------------------------------
//  Route to register a new user and get a new token.
// ---------------------------------------------------------
router.put('', async function(req, res) {
	
	
    if(checkIfEmailInString(req.body.email)){
        // build a new user object
	    let user = new User({
            email: req.body.email,
            password: req.body.password
        });

        user = await user.save(); //save user in DB

        //create a token
	    var payload = {
		    email: user.email,
		    id: user._id	
	    }
	    var options = {
		    expiresIn: 86400 // expires in 24 hours
	    }
	    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
	    res.json({
		    success: true,
		    message: 'Enjoy your token!',
		    token: token,
		    email: user.email,
		    id: user._id,
		    self: "api/v1/" + user._id
	    });
    }

    else{
		res.json({ success: false, message: 'Registration failed. You have to provide a valid e-mail.' })
    }

});

// source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;