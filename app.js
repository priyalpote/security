//jshint esversion:6
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("user", userSchema);

app.route("/")
    .get(function(req, res) {
        res.render("home");
    });
app.route("/login")
    .get(function(req, res) {
        res.render("login");
    })
    .post(function(req, res) {
        const uname = req.body.username;
        const pass = req.body.password;
        User.findOne({ email: uname }, function(err, foundItem) {
            if (!err) {
                if (foundItem != null) {
                    if (foundItem.password === pass) {
                        res.render("secrets")
                    }
                }
            } else {
                console.log(err);
            }
        });
    });
app.route("/register")
    .get(function(req, res) {
        res.render("register");
    })
    .post(function(req, res) {
        const uname = req.body.username;
        const pass = req.body.password;
        const user = new User({
            email: uname,
            password: pass
        });
        user.save(function(err) {
            if (!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});