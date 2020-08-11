const express = require('express');
const bodyParser = require('body-parser')
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

//connect to database
mongoose.connect('mongodb+srv://mean-stack-practice:5UJ2AlsrnlejlOzh@mean-stack-practice.4vsmj.mongodb.net/node-angular?retryWrites=true&w=majority')
.then( () => {
    console.log('Connected to database successful!');
})
.catch( () => {
    console.log('Connected to database failed!');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS, PUT"
    );
    next();
  });

//create posts

app.post('/api/posts', (req, res, next) => {
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
app.put('/api/posts/:id', (req, res, next) => {
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

app.get('/api/posts', (req, res, next) => {
    Post.find()
        //looks at documents in datatbase
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
        });
    });
});

//delete posts

app.delete('/api/posts/:id', (req, res, next) => {
    //params pulls id from url
    Post.deleteOne( {_id: req.params.id})
    //to get result
    .then(result => {
        console.log(result);
        res.status(200).json({message: "Post deleted!"});
    });
});

module.exports = app;
