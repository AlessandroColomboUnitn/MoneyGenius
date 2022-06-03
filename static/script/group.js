async function addGroup(){
    let url = new URL('api/v2/groups/', base);

    var name = document.getElementById("createGroupName").value;

    console.log(name);

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
        window.alert("Gruppo creato con successo!")
        document.getElementById("btnCloseCreateGroupModal").click();
        displayGroupPage();

    }catch(message){
        window.alert(message);
    }
}

function loadGroupInfo(){

    let url = new URL('api/v2/groups/' + loggedUser.group_id, base);
    let params = {token:loggedUser.token, group_token:loggedUser.group_token};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if(!data.success){
            console.log(data);
            throw data.message;
        }else{
            let group = data.group;
            document.getElementById("gi_name").innerHTML = group.name;
        }
    })
    .catch(function(error){
        window.alert(error);
    });
}

async function inviteParticipant(){
    let url = new URL('/api/v2/groups/' + loggedUser.group_id + '/invitations/', base);

    var mail = document.getElementById("inviteMail").value;

    var resp = await fetch(url, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            id: loggedUser.id,
            mail: mail,
            token: loggedUser.token,
            group_token: loggedUser.group_token
        })
    });
    try{
        resp = await resp.json();
        assert(resp.success, resp.message);
        window.alert("Richiesta inviata");
        document.getElementById("btnCloseInviteModal").click();
    }catch(message){
        window.alert(message);
    }
}

//send an asynchronous request to the api to retrieve the list of epenses
//if there arent any expenses do not show the table...
function loadPendingRequest(){

    let url = new URL('api/v2/users/' + loggedUser.id, base);
    let params = {token:loggedUser.token};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data){
            let table = document.getElementById("requestsTable");
            let userExpenses = data.user;
            
            //if i have any expense
            if(userExpenses.length>0){
                //table = createExpensesTable();
                //table = fillExpensesTable(userExpenses, table);       
                //expensesList.appendChild(table);
            }else{
            }
    });
}