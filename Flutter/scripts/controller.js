var email = document.getElementsByName("text")[0];
var errors = document.getElementById("errors");
var username = document.getElementsByName("username")[0];
var password = document.getElementsByName("password")[0];
validatePassword = (password) =>
{
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    return ((password.value.match(upperCaseLetters))
    &&(password.value.match(/[!@#$%^&]/)) 
    && (password.value.length >= 6) 
    && (password.value.match(numbers)));  
}
validateEmail = (email) =>
{
    var lastIndexAt = email.value.lastIndexOf("@");
    var lastIndexDot = email.value.lastIndexOf(".");
    return ((email.value)
    && (email.value.includes('@')) 
    && (!(lastIndexDot === -1 || lastIndexDot <= lastIndexAt))
    && (email.value.length >=5));
}
function validate() {
    if(!(validateEmail(email)))
    {
        errors.textContent = "Email does not meet the conditions!";
        return;
    }
    if(!validatePassword(password))
    {
        errors.textContent = "Password does not meet the conditions!";
        return;
    }
    if (username === null || username === undefined) {
        alert("Login successful");
        loginDatabase(email, password);
    } else {
        alert("Registration is successful");
        registerDatabase(username, email, password);
    }
}

loginDatabase = (email, password) => {
    window.auth.login(email.value, password.value, (isSuccessful, errorCode, errorMessage) => {
        if (isSuccessful) {
            location.replace("./posts.html");
        } else {
            alert(errorMessage);
        }
    })
}

registerDatabase = (username, email, password) => {
    window.auth.register(username.value, email.value, password.value, (isSuccessful, errorCode, errorMessage) => {
        if (isSuccessful) {
            location.replace("./posts.html");
        } else {
            alert(errorMessage);
        }
    })
}

var submitBtn = document.getElementById("btn");
submitBtn.addEventListener("click", validate);