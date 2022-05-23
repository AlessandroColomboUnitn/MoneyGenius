/**
 * This variable stores the logged in user
 */
var loggedUser = {};

function assert(condition, message){
    if (!condition) throw message || "assertion failed";
}
var base="http://localhost:8080";


//code for the modal, code taken from w3schools.com
function loadModal(){
    // Get the modals
    var mdlExpense = document.getElementById("mdlExpense");
    var mdlCategory = document.getElementById("mdlCategory");

    // Get the button that opens the modal
    var btnOpenFormExpense = document.getElementById("btnOpenFormExpense");
    var btnOpenFormCategory = document.getElementById("btnOpenFormCategory")
    // Get the <span> element that closes the modal
    var spanExpense = document.getElementById("spanCloseExpenseForm");
    var spanCategory = document.getElementById("spanCategory");
    // When the user clicks on the button, open the modal
    btnOpenFormExpense.onclick = function() {
        console.log(mdlExpense);
        mdlExpense.style.display = "block";
    }

    btnOpenFormCategory.onclick = function() {
        mdlCategory.style.display="block";}

    // When the user clicks on <span> (x), close the modal
    spanExpense.onclick = function() {
        mdlExpense.style.display = "none";
    }

    spanCategory.onclick = () => mdlCategory.style.display = 'none' ;


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
//even this properties can be obatained with the min name on the input tag
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
async function afterAuth(){

    //document.getElementById("loggedUser").innerHTML = loggedUser.name;
    document.getElementById("navAuthentication").hidden = true;
    document.getElementById("divAuthentication").hidden = true;
    //document.getElementById("divExpense").hidden = false;
    document.getElementById("divBudget").hidden = false;
    document.getElementById("viewBudgetLabel").hidden = false;
    document.getElementById("budgetRimanente").hidden = false;
    
    
    let budget = await fetch('./budget.html');
    budget = await budget.text();
    let divBudget = document.getElementById("divBudget");
    divBudget.innerHTML = budget;
    
    let category = await fetch('./category.html');
    category = await category.text();
    let divCategory = document.getElementById("divCategory");
    divCategory.innerHTML = category;

    let expense = await fetch('./expense.html');
    expense = await expense.text();
    let divExpense = document.getElementById("divExpense");
    divExpense.innerHTML = expense;

    //load the expenses
    loadExpensesList();
    
    //load the expense modal
    loadModal();
        
    //load the category drop down list 
    loadCategoriesOptions();

    showRecapCategories();

    //loads the expenses
    viewBudget();
}

function afterSetBudget(){
    viewBudget();
    document.getElementById("budgetRimanente").hidden = false;
       //set user's default category
    
    fetch('../api/v1/users/'+loggedUser.id+'/categories/default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id: loggedUser.id, token: loggedUser.token, email:loggedUser.email } ),
    })
    .then((resp) => resp.json())
    .then(function(data){
        assert(data.success, data.message);
        //showRecapCategories();
    })
    .catch(function(error){
        window.alert(error);
    });
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
            //window.alert("budget impostato con successo");
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
                let table = createExpensesTable();
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


function loadCategoriesOptions(){
    let url = new URL('api/v1/users/' + loggedUser.id + '/categories', base);
    let params = {token:loggedUser.token};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
 

    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data){
        if(!data.success){
            console.log(data);
            throw data.message;
        }else{
            
            let categoriesSel = document.getElementById("categoryId");
            
            var child = categoriesSel.lastElementChild; 
            while (child) { //clear all children
                categoriesSel.removeChild(child);
                child = categoriesSel.lastElementChild;
            }

            let userCategories = data.categories;
            userCategories.forEach(category => {
                categoriesSel.options[categoriesSel.options.length] = new Option( category.name, category._id,);
            })

            return;
        }
    })
    .catch( 
        (error) => {
            window.alert(error);
            console.error(error);
        }
    );

}

function addExpense(){

    let url = new URL('api/v1/users/' + loggedUser.id + '/expenses', base);

    var name = document.getElementById("name").value;
    console.log("name="+name);
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
                        
            let table = document.getElementById('expensesTable');
            let expense = data.expense;
            //let budget = data.budget;
            //let budget_spent = data.budget_spent;
            
            //create table if its the first expense
            if(!table){
                let expensesList = document.getElementById("expensesList");
               
                //get the span and remove it
                let span = expensesList.firstElementChild;
                expensesList.removeChild(span);

                //create the table and append it
                table = createExpensesTable();
                table = fillExpensesTable(new Array(expense), table);
                expensesList.appendChild(table);
            }else{
                //else just update it 
                table = fillExpensesTable(new Array(expense), table);
            }

            //get close modal icon
            let span = document.getElementById("spanCloseExpenseForm");

            //close the modal
            span.dispatchEvent(new MouseEvent('click'));

            //reset form
            document.getElementById('expenseForm').reset();

            //update budget UI
            viewBudget();
            /*
            //update budget and budget_spent
            document.getElementById("budgetSpentView").innerHTML = budget_spent;
            
            if(!isNaN(budget))
                document.getElementById("budget2View").innerHTML = budget;
            */
        }
        else {
            throw data.message;
        }
    })
    .catch(function(error){
        window.alert(error);
    });
}

//create the table
function createExpensesTable(){
    var table = document.createElement("table");
    table.id = 'expensesTable';
                
    //setup the th row
    let trHeaders = document.createElement("tr");
    let thNames = ['Nome', 'Categoria', 'Totale', 'Data'];
    
    for (i in thNames) {
        let th = document.createElement("th");

        th.innerHTML = thNames[i];

        trHeaders.appendChild(th);
    }

    table.appendChild(trHeaders);

    return table;
}

//fill the table
function fillExpensesTable(userExpenses, table){

    userExpenses.forEach(expense => {

        let trExpense = document.createElement("tr");
        
        for (name in expense) {
            if(name!="_id"){

                let td = document.createElement("td");
                
                if(name=="date")
                    expense[name] = clearDate(expense[name]);

                td.innerHTML = expense [name];

                trExpense.appendChild(td);
            }

        }

        table.appendChild(trExpense);
        
    });

    return table;
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