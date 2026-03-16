function sendData(){
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;

    if(password !== cpassword)
    {
        alert("Password and Confirm Password must be Same")
        return;
    }

    fetch("/app_user",{
        method : "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:name,
            password:password
        })
    })
    .then(res=>{
        if(res.ok)
            window.location="login.html"
    }
    )
}

function findData(){
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    fetch("/app_find",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:name,
            password:password
        }),
    })
    .then(res=>{
        console.log(res);
        if(res.ok){
            window.location="home.html"
        }
        else
            alert("Invalid Credentials")
    })
}