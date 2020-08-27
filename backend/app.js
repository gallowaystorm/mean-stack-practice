const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user')

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
app.use(bodyParser.urlencoded({ extended: false}));
//to grant backend access to images folder and forwards requests to images to backend images
app.use('/images', express.static(path.join('../backend/images')))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PATCH, DELETE, PUT"
    );
    next();
  });


  app.use('/api/posts', postsRoutes);
  app.use('/api/user', userRoutes);


module.exports = app;
