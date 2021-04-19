const mongoose=require('mongoose')

var adminSchema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    hash:{type:String,require:true}
})

mongoose.model("Admin",adminSchema);