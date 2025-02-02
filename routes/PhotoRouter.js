const express = require('express');
const PhotosRouter = express.Router(); // Create a new router for photo-related routes
const db = require('../public/models'); // Import the database models
const multer = require('multer'); // Import multer for handling file uploads

// Configure multer storage engine to save files to the 'public/images' folder with a unique name based on timestamp
const fileStorageEngine = multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, "./public/images"); // Set the destination folder for uploaded images
    },
    filename: (request, file, callback) => {
      callback(null, Date.now() + "--" + file.originalname); // Name the file with a timestamp and original filename
    },
  });

// Filter to ensure only images can be uploaded
const uploadFilter = function (request, file, callback) {
    const fileType = file.mimetype.split('/'); // Split MIME type to check for image
    if (fileType[0] === "image") {
        callback(null, true); // Allow image uploads
    } else {
        callback("You are trying to upload a file that is not an image. Go back and try again", false); // Reject non-image files
    }
};

// Create multer upload instance with the defined file filter and storage engine
const upload = multer({ 
    fileFilter: uploadFilter,
    storage: fileStorageEngine
});

// Route for handling GET requests to fetch all photos
PhotosRouter.route("/")
  .get((request, response) => {
    db.photos
      .findAll() // Retrieve all photos from the database
      .then((photos) => {
        console.log("GET IMAGES"); // Log successful fetch
        response.redirect('/'); // Redirect to homepage after fetching photos
      })
      .catch((error) => {
        response.send(error); // Handle errors if the fetch fails
      });
  })

// Route for handling POST requests to upload a new photo
PhotosRouter.route("/")
  .post(upload.single("photo"), (request, response) => {
    const title = request.body.title; // Retrieve title from request body
    const mediaLocation = request.file.filename; // Retrieve uploaded file's filename
    db.photos
      .create({ title: title, mediaLocation: mediaLocation }) // Create a new photo entry in the database
      .then((photo) => {
        console.log("POST IMAGES"); // Log successful image upload
        response.send(photo); // Send the newly created photo as a response
      })
      .catch((error) => {
        response.send(error); // Handle errors during photo creation
      });
  })

// Route for handling GET requests to fetch comments associated with a specific photo
PhotosRouter.route("/:postId")
  .get(upload.single("photo"), (request, response) => {
        const photoId = request.params.photoId; // Retrieve photoId from URL parameter
        db.comment.findAll({ where: { photoId: photoId } }) // Query comments for the given photoId
            .then((comment) => {
                response.send(comment); // Return the comments as a response
            })
            .catch((error) => {
                response.send(error); // Handle errors fetching comments
            });
    })

module.exports = PhotosRouter; // Export the router for use in the main application
