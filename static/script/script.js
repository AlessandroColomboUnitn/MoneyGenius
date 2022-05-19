/**
 * This variable stores the logged in user
 */
var loggedUser = {};


//once the window is loaded
window.addEventListener("load", function() {

    loadModal();

});

//code for the modal, code taken from w3schools.com
function loadModal(){
    // Get the modal
    var modal = document.getElementById("mdlExpense");

    // Get the button that opens the modal
    var btnOpenFormExpense = document.getElementById("btnOpenFormExpense");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btnOpenFormExpense.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

//checks the input of the expense form, called when the button is clicked
function validateInputs(){
    return validateAmount();
    //checkDate() date should not be int the future or before 2000 for examples
}

//if the amount is not a number or is less than zero send an alert
function validateAmount(){
    //let v = document.forms["expenseForm"]["amount"].value;
    let v = document.getElementById("amount").value;
    
    //if(isNaN(v) || v<=0){
    if (v <= 0) {
        alert("Errore: inserito Totale negativo");
        return false;
    }
    
    return true;
}
//even this properties can be obatained with the min attribute on the input tag

function clearDate(date){
    //split in two the string and return the first half
    return date.split('T')[0];
}


//displays login form after login selection
function displayLogin(){
    document.getElementById("navAuthentication").hidden=true;
    document.getElementById("divAuthentication").hidden=false;
    document.getElementById("Login").hidden=false;
 }

//displays signup form after signup selection
function displaySignup(){
    document.getElementById("navAuthentication").hidden=true;
    document.getElementById("divAuthentication").hidden=false;
    document.getElementById("authName").hidden=false;
    document.getElementById("Signup").hidden=false;
 }

 //resets page and form
function resetForm(){
    document.getElementById("navAuthentication").hidden=false;
    document.getElementById("divAuthentication").hidden=true;
    document.getElementById("authName").hidden=true;
    document.getElementById("Login").hidden=true;
    document.getElementById("Signup").hidden=true;
    document.getElementById("authform").reset();
}

function afterAuth(){
    //document.getElementById("loggedUser").innerHTML = loggedUser.name;
    document.getElementById("navAuthentication").hidden = true;
    document.getElementById("divAuthentication").hidden = true;
    document.getElementById("divExpense").hidden = false;
    document.getElementById("divBudget").hidden = false;

    //loads the expenses
    loadExpensesList();
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

}


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

//send an asynchronous request to the api to retrieve the list of epenses
//if there arent any expenses do not show the table...
function loadExpensesList(){

    fetch('/api/v1/users/123/expenses/',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            token: loggedUser.token, 
            id: loggedUser.id
        })
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data){
        /*if(!data.success){
            console.log(data);
            throw data.message;
        }else{
        */
            //let expensesList = document.getElementById("expensesList");
        let expensesTable = document.getElementById("expensesTable");
        
        data.forEach(expense => {
            //console.log(expense);
            
            let trExpense = document.createElement("tr");
            
            for (attribute in expense) {
                if(attribute!="_id"){
                    let td = document.createElement("td");
                    
                    if(attribute=="date"){
                        td.innerHTML = clearDate( expense [attribute] );
                    }else{
                        td.innerHTML = expense [attribute];
                    }

                    trExpense.appendChild(td);
                }

            }

            expensesTable.appendChild(trExpense);
            });

        return;
    });
    /*})
    .catch( 
        (error) => {
            window.alert(error);
            console.error(error);
        }
    ); // If there is any error you will catch them here
    */
}

function addExpense(){
    var name = document.getElementById("name").value;
    var amount = document.getElementById("amount").value;
    var categoryId = document.getElementById("categoryId").value;
    var date = document.getElementById("date").value;

    fetch('api/v1/users/123/expenses', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            id: loggedUser.id,
            token: loggedUser.token, 
            name: name,
            amount: amount,
            categoryId: categoryId,
            date: date
        })
    })
    .then((resp) => resp.json())
    .then(function(data){/* 
        console.log(data);
        if(data.success){
            window.alert("Nuova spesa registrata");
        }
        else {
            throw data.message;
        }
    })
    .catch(function(error){
        window.alert(error);
    })*/
        console.log(data);
    
    });
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