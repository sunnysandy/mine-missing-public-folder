var express=require("express");
var path = require('path');
var bodyParser=require("body-parser");
//var session = require('express-session');
var sessions = require("client-sessions");
var mongoose = require('mongoose');
var passport = require('passport');
var multer  = require('multer')
  , LocalStrategy = require('passport-local').Strategy;
var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId;
var modelschema=new mongoose.Schema({
  email: { type: String,
           unique: true,
           index: true},
  Password: { type: String, required: true }
})
var infoSchema=new mongoose.Schema({
  Name: { type: String,unique: true},
  DateOfBirth: { type: String, required: true },
  Address: { type: String, required: true },
  MobileNo: { type: String, required: true },
  SkypeId: { type: String, required: true },
  Skills: { type: String, required: true },
  Projects: { type: Array, required: true },
  Services: { type: String, required: true },
  DateOfBirth: { type: String, required: true },
  Qualifications: { type: String, required: true },
  AboutMe: { type: String, required: true },
  Testmonial: { type: String, required: true }
})
var SkillsSchema=new mongoose.Schema({
  SkillName: { type: String,
           unique: true,
           index: true},
  SkillId: { type: String, required: true }
})

var User=mongoose.model('User',modelschema)
var infoUser=mongoose.model('UserInfo',infoSchema,"Myuser");
var GetSkills=mongoose.model('Skills',SkillsSchema,"Skills");

var app=express();
var router = express.Router();

//middle wires
app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'ytdabtasokjmnnesukeoamcewlikdsnajsyhsgjls', // should be a large unguessable string
  duration: 24 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1 * 60 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Newlogin');
app.use("/public",express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//checking a session is existing or not
app.use(function(req,res,next){
  if(req.session&& req.session.user){
      User.findOne({email:req.session.user.email},function(err,user){
        if(!user){
          req.user=user;
          delete req.user.password;
          req.session.user=req.user;
          res.locals.user=req.user;
        }
        next();
      })
  }
  else {
    next();
  }

});
function requirelogin(req,res,next){
  if(!req.user){
      req.redirect("/");
  }
  else {
    next();
  }

}


app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/views/loginpage.html");
})
app.get("/login",function(req,res){
  res.sendFile(__dirname+"/public/views/loginpage.html");
})
app.get("/register",function(req,res){
  res.sendFile(__dirname+"/public/views/register.html");
})

app.get("/upload",function(req,res){
    res.sendFile(__dirname+"/public/uploadimg.html");
})
app.get("/dashboard",function(req,res){
  //console.log(req.session)
  if(req.session &&req.session.user){
    User.findOne({email:req.session.user.email},function(err,user){
      if(!user){
        req.session.reset();
        res.redirect("/")
      }
      else {
        res.locals.user=user;
        res.sendFile(__dirname+"/public/views/dashboard_new1.html");
      }
    })
  }else {
    res.redirect("/")
  }
})
function checkSession(req,res) {
  if(req.session &&req.session.user){
    User.findOne({email:req.session.user.email},function(err,user){
      if(!user){
        req.session.reset();
        return false;
      }
        else {
            res.locals.user=user;
            return true;
        }
    })
  }
}
app.post("/login",function(req,res){
  User.findOne({email:req.body.email},function(err,user){
    if(!user){
      console.log(err)
      res.send({status:"NotOK",msg:"Invalid Email id",url:"/login"});
    }
    else {
      if(req.body.password===user.Password){
        req.session.user=user;
        res.send({status:"OK",msg:"Sucess login",url:"/dashboard"});
      }else{
            res.send({status:"NotOK",msg:"Invalid Password",url:"/login"});
          }
    }
  });
});
app.post("/logout",function(req,res){
  //console.log(req.session)
  if(req.session && req.session.user){
        req.session.reset();
        res.send({status:"OK",msg:"logout sucess",url:"/"});
  }else {
    res.redirect("/")
  }

});

app.post("/getUser",function(req,res){
  User.findById(req.body.id, function(err, doc) {
      res.send({status:"OK",msg:"Sucess login",url:"/dashboard"});
              id     : doc._id
      });
})
app.post("/register",function(req,res){
var user=new User({
  email:req.body.emailid,
  Password:req.body.password
})
user.save(function(error){
  if(error){
    console.log("error: "+error)
    if(error.code==11000){
      res.send("Email id is already existing..")
    }
  }else{
    res.json({status:"OK",msg:"Sucess login",url:"/login"})
  }

})
  //res.json(req.body);
});
app.post("/addUser",function(req,res){
  var userinfo=new infoUser({
    Name:req.body.name,
    DateOfBirth:req.body.dob,
    Address:req.body.address,
    MobileNo:req.body.mobile,
    SkypeId:req.body.skype,
    Skills:req.body.skills,
    Projects:req.body.projects,
    Services:req.body.services,
    Qualifications:req.body.qualifications,
    AboutMe:req.body.aboutme,
    Testmonial:req.body.testmonial
  })
  userinfo.save(function(error){
    if(error){
      console.log("error: "+error)
      if(error.code==11000){
        res.json({status:"NotOK",msg:"is already existing.. Pease choose another name",Name:req.body.name})
        //res.send(req.body.name+" is already existing.. Pease choose another name: ")
      }
    }else{
      res.json({status:"ok",msg:"",UserObj:userinfo})
    }

  })


});
app.get("/users",function(req,res){
  //res.sendFile(__dirname+"/public/AlRayhan.html")
  res.sendFile(__dirname+"/public/template_1/index.html");
})
app.get('/users/:name', function (req, res) {
    if (req.params.name) {
        infoUser.find({ Name: req.params.name }, function (err, docs) {
          //console.log(docs);
            res.json(docs);
        });
    }
});

app.post("/users",function(req,res){
  console.log(req.body.name)
  if (req.body.name) {
      infoUser.find({ Name: req.body.name }, function (err, docs) {
        console.log(docs);
        //res.json({status:"ok",msg:"",UserObj:docs})
        res.json(docs);
      });
  }

});
app.post("/GetSkills",function(req,res){
      GetSkills.find({}, function (err, docs) {
        console.log(docs);
          res.json(docs);
      });

});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/profiles')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
  var upload = multer({ storage : storage }).any(10);
app.post('/profile',function (req, res) {
  upload(req,res,function(err) {
          if(err) {
              console.log(err)
              return res.end("Invalid file path");
          }
          res.end("File is uploaded");
      });

})

app.listen(401,function(){
  console.log("runing mean at 401")
})
