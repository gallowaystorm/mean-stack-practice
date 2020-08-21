const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

//for multer to know where to put files 
const storage = multer.diskStorage( {
    //cb = callback
    destination: (req, file, cb) => {
        //check if mimetype is valid on server side
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) { 
            error = null;
        }
        //images will be stored in backend/images
        cb(error, "../backend/images");
    },
    //tell multer what the file name will be 
    filename: (req, file, cb) => {
        //change name to lowercase and then replace white space with -
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        //create the name of the file with extention
        cb(null, name + '-' + Date.now() + '.' + extension);
    }
});

//create posts
    //multer will store in storage and expects a single file with the propery "image"
    // checkAuth is to verify token
router.post('', checkAuth, multer({storage: storage}).single('image'),(req, res, next) => {
    //get image url
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({ 
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    //saves to database and get result back of save
    post.save().then(result => {
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: result._id,
                title: result.title,
                content: result.content,
                imagePath: result.imagePath
            }
        });
    });
});

//update post
//middleware for images
router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    //check if string or req already has the path
    let imagePath = req.body.imagePath;
    if (req.file) {
        //set image path to url of image
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename; 
    }
    //creates new post
    const post = new Post ({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
    //update post based off id passed in through browser
    Post.updateOne( {_id: req.params.id}, post)
    //if post is successfully updated
    .then( result => {
        console.log(result);
        res.status(200).json({message: 'Update Successful'});
    });
});


//get posts

router.get('', (req, res, next) => {
    //for paginator
        //the plus in front of variables converts to type numbers beacause they are stings comming from the url
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    //postQuery not executed until we call then()
    const postQuery = Post.find();
    if (pageSize && currentPage) {
        //to find select posts
        postQuery
        //skip does not find all posts and skips the first given paramter posts
            //this skips for example page 2 with 10 items each so the query finds pagesize(10) * currentPage(3) - 1
        .skip(pageSize * (currentPage - 1))
        //limits the amount of documents returned
        .limit(pageSize);
    }
    //to find all posts in database
    postQuery.find()
        //looks at documents in datatbase
        .then(documents => {
            //to store amount for fetched posts and allow in next then() statement
            fetchedPosts = documents;
            //for amount of items
            return Post.count();
            //chained then() functions to finally send posts
        }).then(count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: fetchedPosts,
                maxPosts: count
            });
        });
    });

//get single post from server
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then( post => {
        //check if exist
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    })
})

//delete posts

router.delete('/:id', checkAuth, (req, res, next) => {
    //params pulls id from url
    Post.deleteOne( {_id: req.params.id})
    //to get result
    .then(result => {
        console.log(result);
        res.status(200).json({message: "Post deleted!"});
    });
});


//export all routes
module.exports = router;