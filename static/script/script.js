/**
 * This variable stores the logged in user
 */
var loggedUser = {};

function assert(condition, message){
    if (!condition) throw message || "assertion failed";
}
var base="http://localhost:8080";

//once the window is loaded
window.addEventListener("load", function() {

    //loadModal();

});

//code for the modal, code taken from w3schools.com
function loadModal(){
    // Get the modals
    var mdlExpense = document.getElementById("mdlExpense");
    var mdlCategory = document.getElementById("mdlCategory");

    // Get the button that opens the modal
    var btnOpenFormExpense = document.getElementById("btnOpenFormExpense");
    var btnOpenFormCategory = document.getElementById("btnOpenFormCategory");

    // Get the <span> element that closes the modal
    var spanExpense = document.getElementsByClassName("close")[0];
    var spanCategory = document.getElementById("spanCategory");
    // When the user clicks on the button, open the modal
    btnOpenFormExpense.onclick = function() {
        mdlExpense.style.display = "block";
    }

    btnOpenFormCategory.onclick = () => mdlCategory.style.display="block";

    // When the user clicks on <span> (x), close the modal
    spanExpense.onclick = function() {
        mdlExpense.style.display = "none";
    }

    spanCategory.onclick = () => mdlCategory.style.display = "none";


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == mdlExpense) mdlExpense.style.display = "none";
        if (event.target == mdlCategory) mdlCategory.style.display = "none";
    }
}
/*
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
*/

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

//hide the authentication section and show the user homepage
function afterAuth(){
    //document.getElementById("loggedUser").innerHTML = loggedUser.name;
    document.getElementById("navAuthentication").hidden = true;
    document.getElementById("divAuthentication").hidden = true;
    document.getElementById("divExpense").hidden = false;
    document.getElementById("divBudget").hidden = false;
    document.getElementById("viewBudgetLabel").hidden = false;
    
    document.getElementById("divCategory").hidden = false;
    //set user's default category
    fetch('../api/v1/users/'+loggedUser.id+'/categories/default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id: loggedUser.id, token: loggedUser.token, email:loggedUser.email } ),
    })
    .then((resp) => resp.json())
    .then(function(data){
        window.alert(data.success+" "+data.message);
    });


    //fetch the budget html
    fetch('./budget.html')
    .then(response=> response.text())
    .then(text => {
        let divExpense = document.getElementById("divBudget");
        divBudget.innerHTML = text;
    });

    //fetch the expense html
    fetch('./expense.html')
    .then(response=> response.text())
    .then(text => {
        let divExpense = document.getElementById("divExpense");
        divExpense.innerHTML = text;

        //loads the expenses
        loadExpensesList();

        loadModal();

    });

    //load the category drop list input


    //loads the expenses
    viewBudget();

}

function afterSetBudget(){
    viewBudget();
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
            afterSetBudget();
            viewBudget();
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

    let url = new URL('api/v1/users/' + loggedUser.id + '/expenses', base);
    let params = {token:loggedUser.token};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data){
        if(!data.success){
            console.log(data);
            throw data.message;
        }else{

            let expensesList = document.getElementById("expensesList");
            let userExpenses = data.expenses;

            //if i have any expense
            if(userExpenses.length>0){
                let table = createExpensesTable(userExpenses);
                table = fillExpensesTable(userExpenses, table);       
                expensesList.appendChild(table);
            }else{
                let span = document.createElement("span");
                span.innerHTML="Nessuna spesa registrata"; 
                expensesList.appendChild(span);
            }

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

function addExpense(){

    let url = new URL('api/v1/users/' + loggedUser.id + '/expenses', base);

    var name = document.getElementById("name").value;
    var amount = document.getElementById("amount").value;
    var categoryId = document.getElementById("categoryId").value;
    var date = document.getElementById("date").value;

    fetch(url, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            token: loggedUser.token, 
            name: name,
            amount: amount,
            categoryId: categoryId,
            date: date
        })
    })
    .then((resp) => resp.json())
    .then(function(data){

        if(data.success){
            
            window.alert("Nuova spesa registrata");
            
            console.log(data.expense);
            
            let table = document.getElementById('expensesTable');
            let expense = data.expense;
            
            //create table if its the first expense
            if(!table){
                let expensesList = document.getElementById("expensesList");
               
                //get the span and remove it
                let span = expensesList.firstElementChild;
                expensesList.removeChild(span);

                //create the table and append it
                table = createExpensesTable(new Array(expense));
                table = fillExpensesTable(new Array(expense), table);
                expensesList.appendChild(table);                
            }else{
                //else just update it 
                table = fillExpensesTable(new Array(expense), table);
            }


            //get close modal icon
            let span = document.getElementsByClassName("close")[0];

            //close the modal
            span.dispatchEvent(new MouseEvent('click'));

            //reset form
            document.getElementById('expenseForm').reset();
        }
        else {
            throw data.message;
        }
    })
    .catch(function(error){
        window.alert(error);
    });
}

function viewBudget(){
    
    var url = new URL("http://localhost:8080/api/v1/users/" + loggedUser.id + "/budget"),
        params = {token:loggedUser.token}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){ 
        if(data.success){
            document.getElementById("budgetSpentView").innerHTML = data.total_spent;
            document.getElementById("budget2View").innerHTML = data.budget;
        }
        else {
          throw data.message;
        }
    })
    .catch(function(error){
        window.alert(error.message);
    })


}

//create the table
function createExpensesTable(userExpenses){
    var table = document.createElement("table");
    table.id = 'expensesTable';
                
    //setup the th row
    let trHeaders = document.createElement("tr");

    for (attribute in userExpenses[0]) {
        if(attribute!="_id"){

            let th = document.createElement("th");

            th.innerHTML = attribute;

            trHeaders.appendChild(th);
        }
    }
    table.appendChild(trHeaders);

    return table;
}

//fill the table
function fillExpensesTable(userExpenses, table){

    userExpenses.forEach(expense => {

        let trExpense = document.createElement("tr");
        
        for (attribute in expense) {
            if(attribute!="_id"){

                let td = document.createElement("td");
                
                if(attribute=="date")
                    expense[attribute] = clearDate(expense[attribute]);

                td.innerHTML = expense [attribute];

                trExpense.appendChild(td);
            }

        }

        table.appendChild(trExpense);
        
    });

    return table;
}