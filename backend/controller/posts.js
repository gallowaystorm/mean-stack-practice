const Post = require('../models/post');


//create single post
exports.createPost = (req, res, next) => {
    //get image url
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({ 
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        //fetch token to decode and get user id from the middleware checkAuth
        creator: req.userData.userId
    });
    //saves to database and get result back of save
    post.save().then(createdPost => {
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        });
    });
};

//update single post
exports.updatePost = (req, res, next) => {
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
        imagePath: imagePath,
        creator: req.userData.userId
    });
    console.log(post);
    //update post based off id passed in through browser
    //creator checks to see if the id of one updating matches the one creating
    Post.updateOne( {_id: req.params.id, creator: req.userData.userId}, post)
        //if post is successfully updated
        .then( result => {
            //for error catching
            if (result.n > 0){
                res.status(200).json({message: 'Update Successful'});
            } else {
                res.status(401).json({message: 'Not Authroized!'});
            }
        })
        //to catch tecnical errors as well
        .catch(error => {
            res.status(500).json({
                message: "Couldn't update post!"
            });
        });  
};

//get all posts
exports.getAllPosts = (req, res, next) => {
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
        })
        //to catch technical issues
        .catch( error => {
            res.status(500).json({
                message: "Fetching posts failed!"
            });
        });
    };

//get single post
exports.getSinglePost = (req, res, next) => {
    Post.findById(req.params.id).then( post => {
        //check if exist
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    })
    //to catch technical issues
    .catch( error => {
        res.status(500).json({
            message: "Fetching post failed!"
        });
    });
};

//delete single post
exports.deletePost = (req, res, next) => {
    //params pulls id from url
    Post.deleteOne( {_id: req.params.id, creator: req.userData.userId })
    //to get result
    .then(result => {
        //for error catching
        if (result.n > 0){
            res.status(200).json({message: 'Deletion Successful'});
        } else {
            res.status(401).json({message: 'Not Authroized!'});
        }
    })
    //to catch technical issues
    .catch( error => {
        res.status(500).json({
            message: "Deleting post failed!"
        });
    });
};