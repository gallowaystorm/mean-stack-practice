const express = require('express');
const Post = require('../models/post');

const router = express.Router();

//create posts

router.post('', (req, res, next) => {
    const post = new Post({ 
        title: req.body.title,
        content: req.body.content
    });
    //saves to database and get result back of save
    post.save().then(result => {
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Post added successfully',
            postId: result._id
        });
    });
});

//update post
router.put('/:id', (req, res, next) => {
    //creates new post
    const post = new Post ({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
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
    Post.find()
        //looks at documents in datatbase
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
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

router.delete('/:id', (req, res, next) => {
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