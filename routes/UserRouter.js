const { request, response } = require("express");
const express = require("express");
const UsersRouter = express.Router();
const db = require("../public/models");
const bodyParser = require("body-parser");
UsersRouter.use(bodyParser.urlencoded());
UsersRouter.use(bodyParser.json());
const bcrypt = require("bcryptjs");
const saltRounds = 10;

UsersRouter.route("/login").post(async (request, response) => {
    // username and password are required
    console.log(request.body)
    const username = request.body.username;
    const password = request.body.password;
    db.user
      .findOne({ where: { username: username } })
      .then(async (user) => {
        if (user) {
          bcrypt.compare(password, user.password, (error, same) => {
            if (same) {
              //console.log(user.id)
              console.log("logged in, user ID", user.id)
              request.session.userId = user.id;
              response.redirect("/");
            } else {
              response.status(401)
              console.log("401 error");
              response.redirect("/badlogin");
            }
          });
        }
        else{
          response.send("No such user.")
        }
      })
      .catch((error) => {
        console.log(error);
        response.send("You do not have an account, Try signing up");
      });
  });


UsersRouter.route('/signUp')
.post(async(request, response)=>{
    // email, password, username
    const email = request.body.email
    const password = request.body.password
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    const username = request.body.username

    db.user.create({email: email[0], password: encryptedPassword, username: username}).then(user=>{
      //response.send(user)
      response.redirect('/login');
    }).catch(err=>{
        err;
    })
})

module.exports = UsersRouter;