const express = require('express');
const PhotoRouter = express.Router();
const db = require('../public/models');
const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "./public/images");
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + "--" + file.originalname);
    },
});

const uploadFilter = function (request, file, callback) {
    const fileType = file.mimetype.split('/')
    if (fileType[0] === "image") {
        callback(null, True)
    }else {
        callback("You are trying to upload a file that is not an image. Go back and try again", false)
    }
};

const upload = multer({
    fileFilter: uploadFilter,
    storage: fileStorageEngine
})

PhotoRouter.route('/photoId')
    .get((request, response) => {
        db.photo
        .findALL()
        .then((photos) => {
            console.log("GET Images")
            response.redirect('/')
        })
        .catch((error) =>{
            response.send(error)
        })
    })


PhotoRouter.route('/')
    .post(upload.single("photo"), (request, response) => {
        const title = request.body.title
        const mediaLocation = request.file.filename;
        db.photo.create({ title: title, mediaLocation: mediaLocation}).
        then((photo) => {
            console.log("POST Images");
            response.send(photo)
        })
        .catch((error) => {
            response.send(error)
        })
    })


module.exports = PhotoRouter;

PhotoRouter.route('/photoId')
    .post(upload.single("photo"), (request, response) => {
        const photoId = request.params.photoId
        db.comment.findALL({where:{photoId: photoId}}).then((comment) =>{
            response.send(comment)
        }).catch((error) => {
            response.send(error)
        })
    })