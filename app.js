var express    =require("express"),
    app        =express(),
    bodyParser =require("body-parser"),
    mongoose   =require("mongoose"),
    User       =require("./models/user"),
    flash      =require("connect-flash"),
    passport   =require("passport"),
  LocalStrategy=require("passport-local").Strategy,
 methodOverride=require("method-override"),
    Campground =require("./models/campgrounds"),
    Comment    =require("./models/comment"),
    seedDB     =require("./seeds");

var campgroundRoutes=require("./routes/campgrounds"),
    commentRoutes=require("./routes/comments"),
    indexRoutes=require("./routes/index");

mongoose.connect('mongodb://localhost/yelp_camp_v5',{useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
    secret:"I am a nice guy!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
     res.locals.currentUser=req.user;
     res.locals.error=req.flash("error");
     res.locals.success=req.flash("success");
     next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000, process.env.IP, function(){
	console.log("The yelpCamp server has started!!");
});