const express = require("express")
const pug = require("pug")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
var cors = require('cors')


var bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const app = express();
app.use(cors())
const PORT = 5000


// express().get('/')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(express.static("public"))

app.set("view engine", "pug");
app.set("views", "./views");

mongoose.connect('mongodb://localhost/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

}, (err) => {
    if (err) {
        console.log('Err', err)
    } else {
        console.log('DB connected');
    }
}
);

require("./models/Book")
require("./models/Car")
require("./models/User")
require("./models/Admin")


const Book = mongoose.model("Book")

// app.get("/book/add/:name/:author",(req,res)=>{
//      var book=new Book();
//      book.name=req.params.name;
//      book.author=req.params.author;
//      book.save();
//     res.send("book added");


// })

app.post("/book/add", (req, res) => {
    console.log(req.body);
    // res.send("book added");

    var book = new Book();
    book.name = req.body.name;
    book.author = req.body.author;
    book.save().then(data=>{
        console.log("info",data);
        res.json({
            msg: "book added.....!",
            id:data._id
        })
    });

    


})


app.get("/book/list", (req, res) => {
    Book.find().then((data) => {
        console.log(data);
        res.json({ books: data })
    })
})

app.post("/book/update/:id", (req, res) => {
    Book.updateOne(
        { _id: req.params.id }, { name: req.body.name,author:req.body.author }).then(data => {
            console.log({ data })
            res.json({
                message:"Updated"
            })
        })
        .catch(err => {
            console.log("failed", err)
        })
})

app.post("/book/delete/:id", (req, res) => {
    Book.deleteOne(
        { _id: req.params.id }).then(data => {
            console.log({ data });
        }).catch(err => {
            console.log("ERR", err);
            res.json({ msg: "err" })
        })

    res.json({ msg: "data deleted" })

})

//carSchema

const Car = mongoose.model("Car")

// app.get("/car/add/:carName/:carNo",(req,res)=>{
//     var car= new Car()
//     car.carName=req.params.carName;
//     car.carNo=req.params.carNo;
//     car.save();
//     res.send("new car details added")

// })

app.post("/car/add", (req, res) => {
    console.log('gfjh');
    console.log(req.body);
    var car = new Car()
    car.carName = req.body.carName;
    car.carNo = req.body.carNo;
    car.save()
    //  res.send("details added")
    res.json({
        msg: "details added"
    })

})

//list

app.post("/car/list", (req, res) => {
    Car.find().then(data => {
        console.log(data);
        res.json({ cars: data })
    })
})


//update

app.post("/car/update/:id", (req, res) => {
    Car.updateOne(
        { _id: req.params.id }, { carName: req.body.carName }).then(data => {
            console.log("data");
            res.json({
                msg: "data updated"

            })
        })
        .catch(err => {
            console.log("ERROR", err);
        })


})
//delete
app.post("/car/delete/:_id", (req, res) => {
    Car.deleteOne(
        { _id: req.params._id }).then(data => {
            console.log({ data });
        }).catch(err => {
            console.log("ERR", err);
            res.json({ msg: "err" })
        })

    res.json({ msg: "data deleted" })

})

const User = mongoose.model("User");


app.post("/sign-up", (req, res) => {

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            // Store hash in your password DB.

            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.hash = hash

            user.save();
            res.json({ msg: "sucess" })



        });
    });
})

app.post("/login", (req, res) => {
    console.log("working");
    User.findOne({ email: req.body.email }).then(data => {
        // console.log({ data });
        bcrypt.compare(req.body.password, data.hash, (err, result) => {
            console.log(result);
            if (result == true) {
                console.log("dataa ",data._id);
                jwt.sign({userId:data._id},"keyyy", function(err,token){
                    console.log(token);
                    res.json({ 
                        msg: "sucessfull login",
                        token: token
                    })
                })
                

            }
            else {
                res.json({ msg: "login failed" })
            }

        })


        res.json({
            msg:"sucessfull"
        })
    })
})


app.get('/user/info',(req,res)=>{
    var token=req.headers.authorization
    console.log(req.header);

    jwt.verify(token, 'keyyy', function(err, decoded) {
        if(err){
            console.log("key not same",err);
        }
        console.log("msg",decoded) //_id
        User.findOne({_id:decoded.userId}).then(data=>{
            console.log("info",{data});
        
            res.json({
                name:data.name,
                email:data.email
            })
        })
        
      });
      
    
    })   


//admon login

const Admin = mongoose.model("Admin")

app.post('/admin/sign-up', (req, res) => {

    bcrypt.genSalt(saltRounds, (err, salt) => {

        bcrypt.hash(req.body.password, salt, (err, hash) => {
            // Store hash in your password DB.
            var admin = new Admin()
            admin.name = req.body.name;
            admin.email = req.body.email;
            admin.hash = hash


            res.json({
                msg: "sucessfully sign-up"
            })
        })
    })
})
//admin login


app.post('/admin/login', (req, res) => {
    admin.findOne({ email: req.body.email }).then(data => {
        console.log({ data });
        bcrypt.compare(req.body.email, data.hash, (err, result) => {
            console.log(result);


            if (result == true) {
                res.json({
                    msg: "sucessfull"
                })
            }
            else {
                res.json({
                    msg: "login failed"
                })

            }

        })

    })
})






app.get("/", (req, res) => {
    res.send("hello user");
})

app.get("/fashion/:username/:no", (req, res) => {
    console.log(req.params);
    res.render("fashion")
})

app.get("/user", (req, res) => {
    res.send("bye");
})
app.get("/msg", (req, res) => {
    res.send("how are you");
})

app.get("/home", (req, res) => {
    res.render("home")
})

app.get("/fashion", (req, res) => {
    res.render("fashion")
})


app.listen(PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('App started at', PORT);
})
