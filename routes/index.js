var express=require("express");
var router=express.Router();
var passport=require("passport");
var User= require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
});
//auth route
//show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handle sign up form
router.post("/register", function(req,res){
	var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
        	console.log(err);
            req.flash("error",err.message);
        	return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","successfully signed up as "+ req.body.username);
            res.redirect("/campgrounds");
        });
    });
});

//login route
//render login form
router.get("/login", function(req,res){
    res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) ,function(req,res){

});
//logout
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success","logged you out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports= router;