/* import the required module */
const express = require('express');
const db = require('./public/models');
const bodyParser = require("body-parser");

const app = new express();


app.use(express.static('public'))
app.set("view engine", "ejs")

const PhotoRouter = require('./routes/PhotoRouter')
const UserRouter = require('./routes/UserRouter')
const CommentRouter = require('./routes/CommentRouter')
app.use('/images', PhotoRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)


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



app.get("/", (request, response) =>{
    response.render("index");
})