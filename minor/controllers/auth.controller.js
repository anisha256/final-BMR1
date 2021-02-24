const config = require("../config/auth.config");
const db = require("../models");
const Login = db.login;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user } = require("./responseController");

// exports.signup = (req, res) => {
//   const login = new Login({
//     //username: req.body.username,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password, 8)
//   });
//   login
//   .save()
//   .then(result => {
//     console.log(result);
//     res.status(201).json({
//       message:'User created'
//     })
//   })
//   .catch(err =>{
//     console.log(err);
//     res.status(500).json({
//       message:'error'
//     })
//   })
// };
    
exports.signin = (req, res) => {
    console.log(req.body.email);
  Login.findOne({
    
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, login) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!login) {
        return res.render('404');
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        login.password
      );

      if (!passwordIsValid) {
         return res.status(401).send({
           accessToken: null,
           message: "Invalid Password!"
         });
        return res.render('404');
      }

      var token = jwt.sign({ id: login.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < login.roles.length; i++) {
        authorities.push("ROLE_" + login.roles[i].name.toUpperCase());
      }
      // res.status(200).send({
      //   id: login._id,
      //   email: login.email,
      //   email: user.email,
      //   roles: authorities,
      //   accessToken: token
      // });
      res.render('home');
      
    });
  }
