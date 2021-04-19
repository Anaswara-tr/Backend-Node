const mongoose=require('mongoose');

var booksSchema= new mongoose.Schema({
    name:{type: String, required: true},
    author:String,


})

mongoose.model("Book",booksSchema);

