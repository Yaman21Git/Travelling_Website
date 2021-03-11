var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");

router.get("/",function(req,res){
	Campground.find({},function(err, allCampGrounds){
       if(err){
       	console.log(err);
       }
       else res.render("campgrounds/index",{campgtem: allCampGrounds});
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name= req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({name:name,price:price,image:image,description:desc,author:author}, function(err, newlyCreated){
    	if(err){
    		console.log(err);
    	}
    	else res.redirect("/campgrounds");
    });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
         if(err){
         	console.log(err);
         }
         else{
         	console.log(foundcamp);
         	res.render("campgrounds/shows",{campshowTem:foundcamp});
         }
    });
});

router.get("/:id/edit",middleware.checkCampOwner,function(req,res){
        Campground.findById(req.params.id, function(err, foundC){
            res.render("campgrounds/edit",{campgT:foundC});
          });
});

router.put("/:id", middleware.checkCampOwner, function(req,res){
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
         if(err){res.redirect("/campgrounds");}
         else{res.redirect("/campgrounds/"+req.params.id);}
      });
});

router.delete("/:id",middleware.checkCampOwner, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){res.redirect("/campgrounds");}
      else{res.redirect("/campgrounds");}
    });
});

module.exports= router;