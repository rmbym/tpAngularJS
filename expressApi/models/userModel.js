const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    surName: String,
    firstName: String,
    userMail: {type:String, unique: true, required: true}, // doesnt seem to work use unique, i'll put it now for u
    userPwd: String
});
const User = mongoose.model('User', UserSchema);
module.exports = User;

