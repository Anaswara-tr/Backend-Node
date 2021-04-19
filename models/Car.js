const mongoose=require ("mongoose");

var carSchema= new mongoose.Schema({
    carName:{type:String, required:true},
    carNo:Number,
})
mongoose.model("Car",carSchema);