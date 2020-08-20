const mongoose = require('mongoose');
//for validation, needs to be installed by npm
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    //unique allows db to do optimizations and also does not throw error if another email is made with same one
    //(use the plugin above to reverse this and make validate as well)
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//to use plugin and make the unique validator throw error if email is created and one already exists
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);