const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

//get and create posts

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: '1',
            title: 'First server side post',
            content: 'This is coming from the server'
        },
        {
            id: '2',
            title: 'Second server side post',
            content: 'This is coming from the server (second)'
        }
    ]
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});

module.exports = app;
