// const frontendUrl = "http://localhost:3000";
const mongodbUrl = "mongodb+srv://user:userpassword@meditation-community-ap.vgg6t.mongodb.net/meditationCommunity?retryWrites=true&w=majority";
//"mongodb://localhost:27017/meditationCommunity";
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

//code for hashing user password start
const bcrypt = require('bcrypt');
const saltRounds = 10;
//code for hashing user password ends
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    // we're connected!
    // set routes which needs db here
    console.log("connected to mongodb database");

    app.post('/sign-up', async (req, res) => {
        const userObj = req.body; //copied the sign-up data
        
        const userDoc = await User.findOne({ email: req.body.email }).exec();
        //go further only if new email
        if(userDoc==null){
            //hashing the password
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                // Store hash in your password DB.
                userObj.password = hash;
                //store it to database;
                const newUser = new User(userObj);
                newUser.save((err, user) => {
                    if (err) {
                        console.error(err);
                        res.send({ status: 'failed' });
                    } else {
                        console.log("saved");
                        res.send({ status: 'ok' });
                    }
                })
                console.log(userObj);
            });
        }else{
            res.send({
                status:'failed',
                error:'already registered'
            });
        }
    })

    app.post('/sign-in', async (req, res) => {

        //console.log(req.body);
        //finding document of user
        const userDoc = await User.findOne({ email: req.body.email }).exec();
        console.log(userDoc);
        if (userDoc != null) {
            //compare passwored
            bcrypt.compare(req.body.password, userDoc.password)
                .then((result) => {
                    if (result) {
                        res.send({ status: 'ok' });
                    } else {
                        res.send({ status: 'failed' });
                    }
                });
        } else {
            res.send({ status: 'failed' });
        }

    })

});

//set routes here which doesn't need.


const port = 9999;
app.use(cors());//for handling cors
app.use(express.json());//for handling post request bodies
app.get('/', (req, res) => {
    res.send({ name: "mayur", fatherName: "machindra" });
})




//process.env.PORT defines the port from heroku
app.listen(process.env.PORT || port, () => {
    console.log("Meditation-community backend is listening on port: " + port);
})
