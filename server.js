/* Import the required modules */
const express = require('express');
const db = require('./public/models'); // Import database models
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const logger = require("morgan");

const app = new express();

app.use(bodyParser.json()); // Parse JSON request bodies

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Set the view engine to EJS for rendering dynamic views
app.set("view engine", "ejs")

// Use Morgan logger for request logging in "dev" format
app.use(logger("dev"));

app.use(expressSession({
    secret: 'Drew Loves Kinsta', // Secret key for session encryption (consider moving this to environment variables)
    resave: false, // Add recommended options to prevent unnecessary session saves
    saveUninitialized: true
}));

// Define a global variable to track logged-in users (not ideal, better to use session variables)
global.loggedIn = null;

// Middleware to update loggedIn global variable based on session
app.use("*", (request, response, next) => {
  loggedIn = request.session.userId;
  next();
});

// Import route modules
const PhotoRouter = require('./routes/PhotoRouter');
const UserRouter = require('./routes/UserRouter');
const CommentRouter = require('./routes/CommentRouter');
const PageRouter = require('./routes/PageRouter');

// Define API routes
app.use('/images', PhotoRouter);
app.use('/comments', CommentRouter);
app.use('/users', UserRouter);
app.use('/', PageRouter);

// Database connection
const sqlport = 3307;
db.sequelize
    .sync({})
    .then(() => {
        app.listen(sqlport, () => {
            console.log(
                `MariaDB Connection Successful - http://localhost:${sqlport}`
            );
        });
    })
    .catch((error) => {
        console.error("Unable to connect to database", error);
    });

// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`Serving photo app on http://localhost:${port}`);
});


