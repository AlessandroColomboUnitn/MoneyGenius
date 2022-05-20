function addCategory(){
    
    var name = document.getElementById("categoryName").value;
    var color = document.getElementById("categoryColor").value;
    var budget = document.getElementById("categoryBudget").value;
    console.log(color);
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
    }).catch(function(error){
        window.alert(error);
    });
}