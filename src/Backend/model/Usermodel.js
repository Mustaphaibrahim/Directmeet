const { Schema , model } = require('mongoose');

const UserModel = Schema({
    username:String,
    email:String,
    password:String,
    token:String,
    img:Object
},{ timestamps:true });

const User = model('user',UserModel,'users');

module.exports= User;