const express=require('express');
const app=express();
const port=9999;

app.get('/',(req,res)=>{
    res.send("hello mayur is here to help you");
})

app.post('/sign-in',(req,res)=>{
 console.log(req.body);
})

app.post('/sign-up',(req,res)=>{
 console.log(req.body);
})

app.listen(port,()=>{
    console.log("Meditation-community backend is listening on port: "+port);
})