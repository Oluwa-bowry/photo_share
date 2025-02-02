const express = require("express");
const PageRouter = express.Router(); // Create a new router for page-related routes
const db = require('../public/models'); // Import the database models
const fs = require("fs"); // Import the filesystem module for file operations

// Route for handling the homepage
PageRouter.get("/", (request, response) => {
  if (request.session.userId) { // Check if the user is logged in
    const { exec } = require("child_process");
    // Execute shell script to delete non-image files from the images directory
    exec(
      `for item in $(ls $(pwd)/public/images); do
      if [ $( file --mime-type $(pwd)/public/images/$item -b ) != "image/jpeg" ] && [ $( file --mime-type $(pwd)/public/images/$item -b ) != "image/png" ]; then
      echo "$(pwd)/public/images/$item"
      fi; 
      done;`,
      (error, stdout, stderr) => {
        if (stdout) { // If non-image files are found, delete them
          fs.unlink(stdout.slice(0, -1), (err) => {
            if (err) {
              throw err;
            }
          });
          console.log(`Deleted ${stdout} because it wasn't an image`);
        }
      }
    );

    db.photo
      .findAll() // Fetch all photos from the database
      .then((photos) => {
        console.log("GET IMAGES");
        response.render("index", { data: photos }); // Render homepage with photos
      })
      .catch((error) => {
        response.send(error); // Handle errors fetching photos
      });
  } else {
    response.redirect("/login"); // Redirect to login if the user is not logged in
  }
});

// Route for rendering the photo upload page
PageRouter.get("/photo", (request, response) => {
  console.log(request.session.userId);
  if (request.session.userId) { // Check if the user is logged in
    response.render("photo"); // Render photo upload page
  } else {
    response.redirect("/login"); // Redirect to login if the user is not logged in
  }
});

// Route for rendering the login page
PageRouter.get("/login", (request, response) => {
  console.log("/LOGGING IN!");
  response.render("login", { data: "" }); // Render login page
});

// Route for handling incorrect login attempts
PageRouter.get("/badlogin", (request, response) => {
  console.log("/LOGGING IN!");
  response.render("login", { data: "Bad Login Credentials" }); // Render login page with error message
});

// Route for rendering the sign-up page
PageRouter.get("/signUp", (request, response) => {
  console.log("/signUp");
  response.render("signUp"); // Render sign-up page
});

// Route for handling user logout
PageRouter.get("/logout", (request, response) => {
  console.log("logging out");
  request.session.destroy(() => { // Destroy the session on logout
    response.redirect("/login"); // Redirect to login page after logging out
  });
});

// Route for handling 404 errors
PageRouter.get("/*", (request, response) => {
  console.log("404");
  response.render("404"); // Render 404 error page for unknown routes
});

module.exports = PageRouter; // Export the router for use in the main application
