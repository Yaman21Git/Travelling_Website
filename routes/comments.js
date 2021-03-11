var express=require("express");
var router=express.Router({mergeParams: true});
var Comment=require("../models/comment");
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
     Campground.findById(req.params.id,function(err, campG){
         if(err){
         	console.log(err);
         }
         else{
         	res.render("comments/new",{campgrounD:campG});
         }
    });
});

router.post("/", middleware.isLoggedIn,function(req,res){
      Campground.findById(req.params.id, function(err, campG){
          if(err){
          	console.log(err);
          	res.redirect("/campgrounds");
          }
          else{
          	Comment.create(req.body.comment, function(err, commenT){
          	if(err){
          	    console.log(err);
          		}
          	else{
               commenT.author.id=req.user._id;
               commenT.author.username=req.user.username;
               commenT.save();
               campG.comments.push(commenT);
               campG.save();
               console.log(commenT);
               req.flash("success","Your comment has been added");
               res.redirect("/campgrounds/"+ campG._id);
              }
          	});
          }
      });
});

router.get("/:comment_id/edit",middleware.checkCommentOwner, function(req, res){
   Comment.findById(req.params.comment_id, function(err, com){
       if(err){res.redirect("back");}
       else{
        res.render("comments/edit",{campground_id:req.params.id,commentTem:com});
       }
   });
});

router.put("/:comment_id",middleware.checkCommentOwner, function(req,res){
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
         if(err){res.redirect("back");}
         else{res.redirect("/campgrounds/"+req.params.id);}
      });
});

router.delete("/:comment_id",middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){res.redirect("back");}
      else{
        req.flash("success","comment deleted");
        res.redirect("/campgrounds/"+req.params.id);
      }
    });
});

module.exports= router;