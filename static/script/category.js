
function addCategory(){
    
    var name = document.getElementById("categoryName").value;
    var color = document.getElementById("categoryColor").value;
    var budget = document.getElementById("categoryBudget").value;
    fetch('api/v1/users/'+loggedUser.id+'/categories/', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            id: loggedUser.id,
            token: loggedUser.token, 
            name: name,
            color: color,
            budget: budget
        })
    })
    .then((resp) => resp.json())
    .then(function(data){
        assert(data.success, data.message);
        
        if(document.getElementById("tableCat")) document.getElementById("tableCat").remove();
        else document.getElementById("spanCat").remove();
        showRecapCategories(); //first time we have to create the category table
        document.getElementById("spanCategory").click();
        //loadCategoriesOptions();
    }).catch(function(error){
        window.alert(error);
    });
}

function deleteCategory(category_name){
    console.log(category_name);
    fetch('api/v1/users/'+loggedUser.id+'/categories/', {
        method: 'DELETE',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            id: loggedUser.id,
            token: loggedUser.token, 
            name: category_name
        })
    })
    .then( resp => resp.json())
    .then(function(data){
        assert(data.success, data.message);
        document.getElementById("tableCat").remove();
        showRecapCategories();
        loadExpensesList();
        //loadCategoriesOptions();
    })
    .catch(function(error){
        window.alert(error);
    });
}

function createCategoriesTable(){
    var tableCat = document.createElement("tableCat");
    tableCat.id = 'tableCat';

    var thNames = ["Nome", "Speso", "Budget"];
                
    //setup the th row
    let trHeadersCat = document.createElement("tr");

    for (let i = 0; i<thNames.length; i++) {
            let thCat = document.createElement("th");

            thCat.innerHTML = thNames[i];

            trHeadersCat.appendChild(thCat);
    }
    tableCat.appendChild(trHeadersCat);

    return tableCat;
}

function showRecapCategories(){
    
    var url = new URL("api/v1/users/" + loggedUser.id + "/categories", base),
        params = {token:loggedUser.token}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){ 
        if(!data.success){
            console.log(data);
            throw data.message;
        }else{

            let categoriesList = document.getElementById("categoriesList");
            
            let userCategories = data.categories;

            //if i have any expense
            if(userCategories.length>0){
                let tableCat = createCategoriesTable();
                tableCat = fillCategoriesTable(userCategories, tableCat);       
                categoriesList.appendChild(tableCat);
            }else{
                let spanCat = document.createElement("span");
                spanCat.id = "spanCat";
                spanCat.innerHTML="Nessuna categoria registrata"; 
                categoriesList.appendChild(spanCat);
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

function fillCategoriesTable(userCategories, tableCat){

    userCategories.forEach(elementCategory => {

        let trCategory = document.createElement("tr");
        var category_name;
        for (attribute in elementCategory) {
            if(attribute!="_id" && attribute!="color"){
                let td = document.createElement("td");
                td.innerHTML = elementCategory[attribute];
                trCategory.appendChild(td);
                if(attribute === "name") category_name = elementCategory[attribute];
            }
        }
        trCategory.id = category_name+" row";
        let button = document.createElement("button");
        button.innerHTML = "X";
        button.onclick = ()  => deleteCategory(category_name);
        trCategory.appendChild(button);
        tableCat.appendChild(trCategory);
        
    });

    return tableCat;
}
