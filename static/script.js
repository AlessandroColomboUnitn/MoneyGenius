/**
 * This variable stores the logged in user
 */
 var loggedUser = {};

 /**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A student is loaded given the specified email,
 * if it exists, the studentId is used in future calls.
 */
function login()
{
    //get the form object
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    // console.log(email);

    fetch('../api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.self = data.self;
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        document.getElementById("loggedUser").innerHTML = loggedUser.email;
        //console.log(data.id);
        //loadLendings();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

function signup(){
    var email = document.getElementById("signupEmail");
    var password = document.getElementById("signupPassword");

    fetch('../api/v1/authentications',{
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({email: email, password: password} )
    })
    .then((resp) => resp.json)
    .then(function(data){
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.self = data.self;
        document.getElementById("loggedUser").innerHTML = loggedUser.email;      
    })
    .catch(error => console.log(error));
}