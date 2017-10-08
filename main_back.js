var express=require("express");
var path = require('path');
var bodyParser=require("body-parser");
var session = require('express-session')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var mongo=require("mongojs");
var db=mongo("login",["login"]);
//var LoginApi = require('./LoginApi');

var app=express();

var router = express.Router();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use("/public",express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/views/login.html");
})
/*
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
*/
passport.use(new LocalStrategy(
function(username,password, done){
  if(username==password){
    done(null,{id:21,name:username,url:"/home"})
  }
  else {
      done(null,null)
  }

}

))
passport.serializeUser(function(user,done){
  done(null,user.id)
})
passport.deserializeUser(function(id,done){
done({id:id, name:id})
});
app.post("/login",passport.authenticate('local'),function(req,res){
  res.redirect("/");

});
app.get("/login",function(req,res){
  res.sendFile(__dirname+"/public/views/home.html",{
    isAuthenticated:req.isAuthenticated(),
    user:req.user
  });
  /*
  res.render('index',{
    isAuthenticated:req.isAuthenticated(),
    user:req.user
  })*/

})
/*
app.post("/Login",function(req,res){
  var username=req.body.emailid;
  var password=req.body.password;
      db.login.find(function(err, docs){
        if(err){
          console.log(err)
        }
        else {
          res.send(docs);
        }
      })
});
*/
app.listen(401,function(){
  console.log("runing mean at 401")
})
