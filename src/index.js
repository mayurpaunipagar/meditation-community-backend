// const frontendUrl = "http://localhost:3000";
const mongodbUrl = "mongodb://localhost:27017/meditationCommunity";
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String
})
const User = mongoose.model('User', userSchema); //model
const db = mongoose.connection;
const data1 = {
    fullName: "mayur",
    email: "mayur.com",
    password: "check"
}



db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    // we're connected!
    // set routes which needs db here
    console.log("connected to mongodb database");
    app.post('/sign-up', (req, res) => {
        const newUser=new User(req.body);
         newUser.save((err,user)=>{
             if(err){
                 console.error(err);
             }else{
                 console.log("saved");
             }    
         })
        res.send({ status: 'ok' });
        console.log(req.body);
    })

});

//set routes here which doesn't need.


const port = 9999;
app.use(cors());//for handling cors
app.use(express.json());//for handling post request bodies
app.get('/', (req, res) => {
    res.send({ name: "mayur", fatherName: "machindra" });
})

app.post('/sign-in', (req, res) => {
    res.send({ status: 'ok' });
    console.log(req.body);
})


//process.env.PORT defines the port from heroku
app.listen(process.env.PORT || port, () => {
    console.log("Meditation-community backend is listening on port: " + port);
})
