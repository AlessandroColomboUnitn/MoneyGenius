/**
 * This variable stores the logged in user
 */
 var loggedUser = {};


//displays login form after login selection
function displayLogin(){
    document.getElementById("authEmail").hidden=false;
    document.getElementById("authPassword").hidden=false;
    document.getElementById("setLogin").hidden=true;
    document.getElementById("setSignup").hidden=true;
    document.getElementById("Login").hidden=false;
    document.getElementById("back").hidden=false;
 }

//displays signup form after signup selection
function displaySignup(){
    document.getElementById("authEmail").hidden=false;
    document.getElementById("authPassword").hidden=false;
    document.getElementById("authName").hidden=false;
    document.getElementById("setLogin").hidden=true;
    document.getElementById("setSignup").hidden=true;
    document.getElementById("Signup").hidden=false;
    document.getElementById("back").hidden=false;
 }

 function resetForm(){
    document.getElementById("authEmail").hidden=true;
    document.getElementById("authPassword").hidden=true;
    document.getElementById("authName").hidden=true;
    document.getElementById("setLogin").hidden=false;
    document.getElementById("setSignup").hidden=false;
    document.getElementById("Signup").hidden=true;
    document.getElementById("Login").hidden=true;
    document.getElementById("back").hidden=true;
    document.getElementById("authform").reset();
 }

 function afterAuth(){
    document.getElementById("loggedUser").innerHTML = loggedUser.name;
    document.getElementById("budgetform").hidden = false;
    document.getElementById("viewBudgetLabel").hidden = false;
 }

 /** 
 * Based on source: https://github.com/unitn-software-engineering/EasyLib/blob/master/static/script.js 
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A user is loaded given the specified email,
 * if it exists, the userId is used in future calls.
 */
function login()
{
    //get the form object
    var email = document.getElementById("authEmail").value;
    var password = document.getElementById("authPassword").value;
    // console.log(email);

    fetch('../api/v1/authentications/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data){
        if(!data.success) throw data.message;
        else{
            loggedUser.token = data.token;
            loggedUser.email = data.email;
            loggedUser.name = data.name;
            loggedUser.id = data.id;
            loggedUser.self = data.self;
            // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
            resetForm();
            afterAuth();
            //console.log(data.id);
            //loadLendings();
            return;
        }
    })
    .catch( 
        (error) => {
            window.alert(error);
            console.error(error);
        }
    ); // If there is any error you will catch them here

};


/**
 * This function is called when the signup button is pressed.
 * A new user will be inserted in the DB using same username and password provided in the authentication form. 
 */
function signup(){
    var email = document.getElementById("authEmail").value;
    var password = document.getElementById("authPassword").value;
    var name = document.getElementById("authName").value;
    fetch('../api/v1/authentications/signup',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({email: email, password: password, name: name} )
    })
    .then(resp => resp.json())
    .then(function(data){
        if(!data.success) throw data.message;
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.name = data.name;
        loggedUser.id = data.id;
        loggedUser.self = data.self;        
        resetForm();
        afterAuth();
        return;
    })
    .catch((error) => {
        window.alert(error);
        console.error(error);
    });
}

function setBudget(){
    var budget = document.getElementById("budget").value;
    fetch('../api/v1/users/setBudget', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            email: loggedUser.email, 
            token: loggedUser.token, 
            budget: budget} )
    })
    .then((resp) => resp.json())
    .then(function(data){ 
        if(data.success){
            window.alert("budget impostato con successo");
        }
        else {
            throw data.message;
        }
    })
    .catch(function(error){
        window.alert("impossibile impostare il budget");
    })
}


function viewBudget(){
    fetch('../api/v1/viewBudget', {
        method: 'GET',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            email: loggedUser.email, 
            token: loggedUser.token} )
    })
    .then((resp) => resp.json())
    .then(function(data){ 
        if(data.success){
            document.getElementById(data.budget_spent).innerHTML = budgetSpentView;
            window.alert("budget mostrato");
        }
        else {
            throw data.message;
        }
    })
    .catch(function(error){
        window.alert("impossibile visualizzare il budget");
    })
}