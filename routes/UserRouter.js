const { request, response } = require("express"); // Import request and response objects from Express (not necessary in this case)
const express = require("express");
const UsersRouter = express.Router(); // Create an Express Router instance for user-related routes
const db = require("../public/models"); // Import database models
const bodyParser = require("body-parser"); // Import body-parser to handle request bodies

UsersRouter.use(bodyParser.urlencoded()); // Middleware to parse URL-encoded form data
UsersRouter.use(bodyParser.json()); // Middleware to parse JSON request bodies

const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const saltRounds = 10; // Define salt rounds for password hashing

UsersRouter.route("/login").post(async (request, response) => {
    // Handle user login
    console.log(request.body);
    const username = request.body.username;
    const password = request.body.password;

    db.user
      .findOne({ where: { username: username } }) // Query database to find user by username
      .then(async (user) => {
        if (user) {
          bcrypt.compare(password, user.password, (error, same) => { 
            // Compare provided password with hashed password stored in the database
            if (same) {
              console.log("logged in, user ID", user.id);
              request.session.userId = user.id; // Store user ID in session
              response.redirect("/"); // Redirect to home page on successful login
            } else {
              response.status(401); // Unauthorized status for incorrect password
              console.log("401 error");
              response.redirect("/badlogin"); // Redirect to an error page
            }
          });
        } else {
          response.send("No such user."); // Send response if user is not found
        }
      })
      .catch((error) => {
        console.log(error);
        response.send("You do not have an account, Try signing up"); // Send response if an error occurs
      });
  });

UsersRouter.route('/signUp')
.post(async(request, response)=>{ 
    // Handle user registration

    const email = request.body.email;
    const password = request.body.password;
    const encryptedPassword = await bcrypt.hash(password, saltRounds); // Hash password before storing it
    const username = request.body.username;

    db.user.create({ email: email[0], password: encryptedPassword, username: username }) 
    // Create new user entry in the database
    .then(user => {
      response.redirect('/login'); // Redirect to login page after successful signup
    })
    .catch(err => {
        err; // Error handling is missing, should log or return an error response
    });
});

module.exports = UsersRouter; // Export the router to be used in other parts of the application
