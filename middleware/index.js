var middlewareObj={};
var Comment=require("../models/comment");
var Campground=require("../models/campgrounds");

middlewareObj.checkCampOwner=function(req, res, next){
  if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundC){
        if(err){
          req.flash("error","Campground not found");
          res.redirect("back");
        }
        else{
          if(foundC.author.id.equals(req.user._id)){
            next();
          }
          else {
            req.flash("error","You don't have permission to do that");
            res.redirect("back");
          }
          }
        });
     }else{
        req.flash("error","You need to login to do that");
        res.redirect("back");
     }
}

middlewareObj.checkCommentOwner =function(req, res, next){
  if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComm){
        if(err){res.redirect("back");}
        else{
          if(foundComm.author.id.equals(req.user._id)){
            next();
          }
          else{
            req.flash("error","You don't have permission to do that");
            res.redirect("back");
          } 
          }
        });
     }else{
        req.flash("error","You need to login to do that");
        res.redirect("back");
     }
}

middlewareObj.isLoggedIn= function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","You need to login to do that");
  res.redirect("/login");
}


module.exports= middlewareObj;