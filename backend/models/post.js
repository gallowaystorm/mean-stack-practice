const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    //this is how to connect schemas through foreign keys
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  }
});

module.exports = mongoose.model('Post', postSchema);