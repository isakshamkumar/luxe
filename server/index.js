const express = require('express')
let bodyParser= require('body-parser')
const app = express()
const port = 3005
// app.use(middleware1)
const fs = require('fs');
const path = require('path');
const cors = require('cors');//this tells server that request can come from anywhere, this should only be used innproduction starting apps
app.use(bodyParser.json()) // bodyparser.json returns a middleware which also as in our fuctin case does something(extactig body data here) and calls a next()
app.use(cors());


let userEmails=[];
try {
    userEmails = JSON.parse(fs.readFileSync('UserEmails.json', 'utf8'));
   
} catch {
    userEmails=[];
}

app.post('/signup',(req,res)=>{
   const userDetails=req.body;
   let existingEmail=userEmails.find(user=>user.email===userDetails.email);
   if(existingEmail){
    res.status(404).send('Email Already Exists');
   }
   else{
    
    userEmails.push(userDetails)
    fs.writeFileSync('UserEmails.json', JSON.stringify(userEmails));
    res.json({message:'User Signed Up',details:userDetails})
   }

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  