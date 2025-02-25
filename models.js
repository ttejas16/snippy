const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true
    }
});

const snippetSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    title:{
        type:String,
    },
    code:{
        type: String
    },
    language:{
        type: String,
    },
    snippetId:{
        type: String
    }
})

const User = mongoose.model('user', userSchema);
const Snippet = mongoose.model('snippet', snippetSchema);

module.exports = {
    User,Snippet
}