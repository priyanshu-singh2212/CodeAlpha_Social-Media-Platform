const API_URL = "http://localhost:5000/api/users";

// REGISTER

const registerForm =
document.getElementById("registerForm");

if(registerForm){

registerForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const username =
document.getElementById("username").value;

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const response =
await fetch(
`${API_URL}/register`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
email,
password
})
}
);

const data =
await response.json();

alert(data.message);

if(response.ok){
window.location.href =
"login.html";
}

});
}

// LOGIN

const loginForm =
document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const response =
await fetch(
`${API_URL}/login`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
}
);

const data =
await response.json();

if(response.ok){

localStorage.setItem(
"token",
data.token
);

window.location.href =
"feed.html";

}else{

alert(data.message);

}

});
}