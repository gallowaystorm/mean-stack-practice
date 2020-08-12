const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');

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


  app.use('/api/posts', postsRoutes);


module.exports = app;
