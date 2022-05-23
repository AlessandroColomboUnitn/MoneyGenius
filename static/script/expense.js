//called when 'Aggiungi' button of the expense form is clicked
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

//send an asynchronous request to the api to retrieve the list of expenses
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

//send an asynchronous request to the api to retrieve the list of categories
//then add the option to the drop down list
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
                    expense[name] = clearDateBis(new Date(expense[name]).toLocaleString());//clearDate(expense[name]);

                td.innerHTML = expense [name];

                trExpense.appendChild(td);
            }

        }

        table.appendChild(trExpense);
        
    });

    return table;
}

/*
//return a readable date
function clearDate(date){
    //split in two the string and return the first half
    return date.split('T')[0];
}
*/

function clearDateBis(date){
    //split in two the string and return the first half
    return date.split(',')[0];
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