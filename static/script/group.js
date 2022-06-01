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

function displayGroup(){

    document.getElementById("userPage").hidden = true;
    document.getElementById("groupPage").hidden = false;
    
}

function displayUser(){
    
    document.getElementById("userPage").hidden = false;
    document.getElementById("groupPage").hidden = true;

}

async function loadGroup(){
    
    let url = new URL('/api/v2/groups/'+loggedUser.group_id, base);
    let params = {token:loggedUser.token, group_token: loggedUser.group_token};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    let resp = await fetch(url);
    resp = await resp.json();
    window.alert(resp);

}