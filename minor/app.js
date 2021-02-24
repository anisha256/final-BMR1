// Imports
const http = require('http');
const express = require('express')
const app = express()
const path = require("path");

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const reportController = require('./controllers/reportController');
const blockchainController = require('./controllers/blockchainController');
const responseController = require('./controllers/responseController');
const { verifySignUp } = require("./middlewares");
const logincontroller = require("./controllers/auth.controller");
const {enrollAdmin} = require('./controllers/blockchainController')
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

const cors = require("cors");
var corsOptions = {
    origin: "http://localhost:8081"
  };


// require("./db/conn");
var User = require('./models/User');
// var Login = require('./login')

// Static Files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//console.log(process.env);

// set views
app.set('views', './views')
app.set('view engine', 'ejs')

//Db connection start
mongoose.Promise =global.Promise;
mongoose.connect('mongodb://localhost:27017/test',{useNewUrlParser:true})
.then(()=> console.log('connection sucessful'))
.catch((err) => console.log('connection failed'))


enrollAdmin();  
function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "patient"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'patient' to roles collection");
        });
  
        new Role({
          name: "doctor"
        }).save(err => {
          if (err) {
            console.log("doctor", err);
          }
  
          console.log("added 'doctor' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

// module.exports = function(app) {
//     app.use(function(req, res, next) {
//       res.header(
//         "Access-Control-Allow-Headers",
//         "x-access-token, Origin, Content-Type, Accept"
//       );
//       next();
//     });
app.post('/signup',
[
  verifySignUp.checkDuplicateUsernameOrEmail,
  verifySignUp.checkRolesExisted
],

//logincontroller.signup,
blockchainController.registerAndEnrollUser,
responseController.ca); 
    
    
      


app.post("/signin", logincontroller.signin
);
 

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    res.render('about-us')
})

app.get('/tracking', (req, res) => {
    res.render('tracking')
})

app.get('/contact', (req, res) => {
    res.render('contact-us')
    req.session.destroy()
})

app.get('/doctor_details', (req, res) => {
    res.render('doctor_details')
})

app.get('/quote', (req, res) => {
    res.render('quote',{
        data:{}
    })
})

// app.post('/quote', function(req, res){
//     res.render('quote',{
//         data:req.body
//     })
//     console.log(req.body.doctorName)
//     console.log(req.body.patientName)
//     var user= new User({
//         doctorName :req.body.doctorName,
//         patientName : req.body.patientName,
//         // hospitalName: res.body.hospitalName,
//         height: req.body.height,
//         weight: req.body.weight,
//         description: req.body.description
//     })
//     var promise = user.save()
//     promise.then((user) => {
//         console.log("user saved",user)

//     })
    
// })

app.post('/quote',reportController.createMr,
blockchainController.invokeChaincode,
responseController.user)


//searching
// app.get('/:id',  function(req, res){
//     User.findById(req.params.id,
//         function(err, doctor){
//             if(err){
//                 console.log("Error!");
//             }
//             else{
//                 res.render('doctor',{doctor: doctor});
//             }
//         })})

//Listen to port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))