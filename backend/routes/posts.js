const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const PostsController = require('../controller/posts');


//create posts
    //multer will store in storage and expects a single file with the propery "image"
    // checkAuth is to verify token
router.post('', checkAuth, extractFile, PostsController.createPost);

//update post
//middleware for images
router.put('/:id', checkAuth, extractFile, PostsController.updatePost);


//get all posts
router.get('', PostsController.getAllPosts);

//get single post from server
router.get('/:id', PostsController.getSinglePost);

//delete posts
router.delete('/:id', checkAuth, PostsController.deletePost);


//export all routes
module.exports = router;