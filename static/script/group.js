function displayUserPage(){
    document.getElementById("userPage").hidden = false;
    document.getElementById("groupPage").hidden = true;
    document.getElementById("btnCloseNav").click();
}

async function displayGroupPage(){
    document.getElementById("userPage").hidden = true;
    document.getElementById("groupPage").hidden = false;
    document.getElementById("btnCloseNav").click();

    let gruppo = null;//chiamata a fun che cerca utente tra gruppi
    let groupPage;
    if(gruppo){
        groupPage = await fetch('./group.html');
        groupPage = await groupPage.text();

        loadGroupInfo();
        loadGroupExpensesList();
    }else{
        groupPage = await fetch('./groupForm.html');
        groupPage = await groupPage.text();
    }

    document.getElementById("groupPage").innerHTML = groupPage;
}

/*
async function addGroup(){
    let url = new URL('api/v2/groups/', base);

    var name = document.getElementById("groupName").value;
    var resp = await fetch(url, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            id: loggedUser.id,
            token: loggedUser.token, 
            name: name,
        })
    });
    try{
        resp = await resp.json();
        assert(resp.success, resp.message);
        loggedUser.group_token = resp.group_token;
        loggedUser.group_id = resp.group_id;
        sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        loadGroup();
        displayGroup();
    }catch(message){
        window.alert(message);
    }
}

//send an asynchronous request to the api to retrieve the list of epenses
//if there arent any expenses do not show the table...
function loadGroupExpensesList(){
    let url = new URL('/api/v2/groups/'+loggedUser.group_id + '/expenses', base);
    let params = {token:loggedUser.token, group_token: loggedUser.group_token};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data){
        if(!data.success){
            console.log(data);
            throw data.message;
        }else{

            let expensesList = document.getElementById("expensesList");
            let table = document.getElementById("expensesTable");
            let userExpenses = data.expenses;
            
            //clear the table
            if(table)
                table.remove();
            
            //if i have any expense
            if(userExpenses.length>0){
                //if its the first expense
                let alertNoExpense = document.getElementById("alertNoExpense");
                if(alertNoExpense)
                    expensesList.removeChild(alertNoExpense);

                table = createExpensesTable();
                table = fillExpensesTable(userExpenses, table);       
                expensesList.appendChild(table);
            }else{
                let alertNoExpense = document.createElement("div");
                alertNoExpense.id ="alertNoExpense";
                alertNoExpense.classList.add("alert", "alert-info");
                alertNoExpense.innerHTML="  <strong>Info!</strong> Nessuna spesa registrata."; 
                expensesList.appendChild(alertNoExpense);
            }
        }
    })
    .catch( 
        (error) => {
            window.alert(error);
            console.error(error);
        }
    ); // If there is any error you will catch them here
}

//create the table
function createExpensesTable(){
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var trHeaders = document.createElement("tr");

    table.id = 'expensesTable';
    table.classList.add("table");
    table.classList.add("table-hover");
    table.classList.add("text-center");
                
    //setup the th row
    let thatt = ['Nome', 'Categoria', 'Totale', 'Data'];
    
    for (i in thatt) {
        let th = document.createElement("th");

        th.innerHTML = thatt[i];

        trHeaders.appendChild(th);
    }
    
    thead.appendChild(trHeaders);
    table.appendChild(thead);

    return table;
}

//fill the table
function fillExpensesTable(userExpenses, table){

    var tbody = document.createElement("tbody");

    userExpenses.forEach(expense => {

        let trExpense = document.createElement("tr");
        
        for (att in expense) {
            if(att!="_id"){

                let td = document.createElement("td");
                
                if(att=="date")
                    expense[att] = clearDateBis(new Date(expense[att]).toLocaleString());//clearDate(expense[name]);

                if(att=="amount")
                    expense[att] = expense[att] + "€";

                td.innerHTML = expense [att];

                trExpense.appendChild(td);
            }else{
                trExpense.id = expense[att];
            }

        }

        trExpense.onclick = () => {
            viewExpense(trExpense.id);
        }

        tbody.appendChild(trExpense);
        
    });

    table.appendChild(tbody);

    return table;
}

*/