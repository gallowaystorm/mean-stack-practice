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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

//create posts

app.post('/api/posts', (req, res, next) => {
    const post = new Post({ 
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    res.status(201).json({
        message: 'Post added successfully'
    });
});


//get posts

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
        });
    });
});

module.exports = app;
