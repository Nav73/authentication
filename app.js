//jshint esversion:6
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const encrypt = require("mongoose-encryption")

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]})

const User = new mongoose.model("User", userSchema);




app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))


app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

//posts

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then((savedDoc => {
        console.log("user has saved to database sucessfully." + savedDoc)
        res.render("secrets")
    })).catch(err => {
        console.lof("error while saving user to the database." + err)
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password  
    console.log(username + " " + password) 
    User.findOne({email: username}).then((foundUser) => {
        console.log(foundUser)
        if((foundUser.password === password)) {
            console.log("user verified sucessfully.")
            res.render("secrets")
        }
    }).catch (err => {
        res.status(500).send("error in verifying the user." + err)
    })
    
})




app.listen(3000, () => {
    console.log("Server started on port 3000.")
})