var express=require("express");
var path = require('path');
var bodyParser=require("body-parser");
//var session = require('express-session');
var sessions = require("client-sessions");
var mongoose = require('mongoose');
var passport = require('passport');
var multer  = require('multer');
//var UploadApi=require("./APIs/UploadFile")
  var LocalStrategy = require('passport-local').Strategy;
var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId;
var modelschema=new mongoose.Schema({
  email: { type: String,
           unique: true,
           index: true},
  Password: { type: String, required: true }
})
var infoSchema=new mongoose.Schema({
  email: { type: String,
           unique: true,
           index: true},
  Password: { type: String, required: true }
})
var SkillsSchema=new mongoose.Schema({
  SkillName: { type: String,
           unique: true,
           index: true},
  SkillId: { type: String, required: true }
})

var User=mongoose.model('User',modelschema)
var infoUser=mongoose.model('UserInfo',infoSchema,"UserInfo");
var GetSkills=mongoose.model('Skills',SkillsSchema,"Skills");

var app=express();
var router = express.Router();

//UploadApi.UploadImg("images");

//middle wires
app.use(sessions({
  cookieName: 'Session', // cookie name dictates the key name added to the request object
  secret: 'ytdabtasokjmnnesukeoamcewlikdsnajsyhsgjls', // should be a large unguessable string
  duration: 24 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 5 * 60 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Newlogin');

app.use("/public",express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/views/loginpage.html");
})
app.get("/login",function(req,res){
  res.sendFile(__dirname+"/public/views/loginpage.html");
})
app.get("/register",function(req,res){
  res.sendFile(__dirname+"/public/views/register.html");
})
app.get("/dashboard",function(req,res){
  res.sendFile(__dirname+"/public/views/dashboard.html");
})
app.post("/login",function(req,res){
  User.findOne({email:req.body.emailid},function(err,user){
    if(!user){
      //console.log(err)
      res.send({status:"NotOK",msg:"Invalid Email id",url:"/login"});
    }
    else {
      if(req.body.password===user.Password){
      //  req.session.user=user;//set-cookie: session email,password
        res.send({status:"OK",msg:"Sucess login",url:"/dashboard"});
      }else{
            res.send({status:"NotOK",msg:"Invalid Password",url:"/login"});
          }
    }
  });
});
app.post("/register",function(req,res){
var user=new User({
  email:req.body.emailid,
  Password:req.body.password
})

User.on('index', function (error) {
  user.save(function(error){
    if(error){
      console.log("error: "+error)
      if(error.code==11000){
        res.send("Email id is already existing..")
      }
    }else{
      res.json({ok:"ok",userName:user})
    }

  })
});

  //res.json(req.body);
});
app.post("/getUser",function(req,res){
  User.findById(req.body.id, function(err, doc) {
      res.send({status:"OK",msg:"Sucess login",url:"/dashboard"});
              id     : doc._id
      });
})


app.get('/users/:email', function (req, res) {
    if (req.params.email) {
        infoUser.find({ email: req.params.email }, function (err, docs) {
          console.log(docs);
            res.json(docs);
        });
    }
});

app.get("/skills",function(req,res){
  res.sendFile(__dirname+"/public/skills.html");
});
app.post("/SetSkills",function(req,res){
  var skills=new GetSkills({
    SkillName:req.body.skillName,
    SkillId:req.body.SkillId
  })
  GetSkills.on('index', function (error) {
    skills.save(function(error){
      if(error){
        console.log("error: "+error)
        if(error.code==11000){
          res.send("Email id is already existing..")
        }
      }else{
        res.json({ok:"ok",userName:user})
      }

    })
  });
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
    cb(null, file.fieldname + '-' + Date.now())
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
