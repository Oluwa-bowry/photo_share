/* import the required module */
const express = require('express');
const db = require('./public/models');
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const logger = require("morgan");

const app = new express();

app.use(bodyParser.json());
// serve static files from public
app.use(express.static('public'))
// set the view engine to ejs
app.set("view engine", "ejs")

app.use(logger("dev"));

app.use(expressSession({
    secret: 'Drew Loves Kinsta'
}))
global.loggedIn = null;
app.use("*", (request, response, next) => {
  loggedIn = request.session.userId;
  next();
});

const PhotoRouter = require('./routes/PhotoRouter')
const UserRouter = require('./routes/UserRouter')
const CommentRouter = require('./routes/CommentRouter')
const PageRouter = require('./routes/PageRouter')
app.use('/images', PhotoRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)
app.use('/', PageRouter)


//db
const sqlport = 3307;
db.sequelize
    .sync({})
    .then(() => {
        app.listen(sqlport, () =>{
            console.log(
                `Mariadb Connection Successful - http://localhost ${sqlport}`
            )
        })
    })

    .catch((error) => {
        console.error("Unabl to connect to database", error)
    });


//server
const port = 8080;
app.listen(port, () =>{
    console.log(`serving photo app on http://localhost:${port}`)
});


//routes
