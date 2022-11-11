const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bcrypt = require('bcrypt');

app.use(express.json());

//Regex
var regEXname = /^[a-zA-Z]+$/;
var regEeMID = /[a-zA-Z0-9]+@northeastern.edu+$/;
//Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
var regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//DB CONNECTION
mongoose.connect('mongodb+srv://ssankararavind:Info6150@cluster0.epjymz8.mongodb.net/?retryWrites=true&w=majority', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true 
},(err) => {
    if(!err){
        console.log("Connected to DB...");
    }
    else{
        console.log("Error!!  "+ err);
    }
})

//SCHEMA

const sch={
    name:String,
    email:String,
    password:String
}

const monmodel=mongoose.model("NEWCOLL",sch);

//POST

app.post("/user/create",async(req,res)=>{
    console.log("Post Function!");

    var flag = regexCheck(req);
    if (flag == 0)
    {
        try {
            const salt = await bcrypt.genSalt();
            const uppassword = await bcrypt.hash(req.body.password, salt);
    
            console.log("salt =>" + salt);
            console.log("UpdatedPassword =>" + uppassword);
    
            const data= new monmodel({
            name:req.body.name,
            email:req.body.email,
            password:uppassword
            });

    const val=await data.save();
    res.json(val);
    }
        catch
            {
                console.log("In the catch block");
            }
    }
        else if(flag == 1)
        {
            res.send("Invalid value!!Please enter First name with only Alphabets");
        }
        else if(flag == 2)
        {
            res.send("Invalid value!!Please enter your Northeastern Email address");
        }
        else if(flag == 3)
        {
            res.send("Invalid value!!Please enter a Minimum of eight characters with at least one uppercase letter, one lowercase letter, one number and one special character");
        }
        else{
            /*Do Nothing */
        }
    })

//PUT

app.put("/user/edit/:email",async(req,res)=>{
    console.log("Put Function!");

    let upemail=req.params.email;
    var flag = regexChecknoEmail(req);
    if (flag == 0)
    {
        try {
        
            const salt = await bcrypt.genSalt();
            let uppassword = await bcrypt.hash(req.body.password, salt);
            let upname=req.body.name;
            //let uppassword=req.body.password;
        
            monmodel.findOneAndUpdate({email:upemail},{$set:{name:upname,password:uppassword}},
                {new:true},
                (err,data)=>{
        
                    if(err)
                    {
                      res.send("ERROR!!!")
                    }
                    else{
                        if(data==null)
                        {
                            res.send("Nothing found")
                        }
                        else{
                            res.send(data)
                        }
                    }
            });
        }
    catch
            {
                console.log("In the catch block");
            }
    
        }
        else if(flag == 1)
        {
            res.send("Invalid value!!Please enter First name with only Alphabets");
        }
        else if(flag == 3)
        {
            res.send("Invalid value!!Please enter a Minimum of eight characters with at least one uppercase letter, one lowercase letter, one number and one special character");
        }
        else{
            /*Do Nothing */
        }

});

//DELETE

app.delete("/user/delete/:email",function(req,res){

    let delemail=req.params.email;
    monmodel.findOneAndDelete(({email:delemail}),function(err,docs){
        
        if(err)
            {
              res.send("ERROR!!!")
            }
            else{
                if(docs==null){
                res.send("Nothing to delete!");
                }
                else{
                    res.send("Record deleted!");
                    res.send(docs);
                }
            }

    })

})

//GET

app.get('/user/getAll', (req, res) => {
    monmodel.find((err, val) => {
        if (err) {
            console.log("Error =>" + err);
            res.send("Error =>" + err);
        }
        else {
            res.json(val);
        }
    });
});

////////

function regexCheck(request)
{
    var flag = 0;
    if (request.body.name.trim().match(regEXname)){
        console.log("Name regex Successfull");
        if (request.body.email.trim().match(regEeMID)) {
            console.log("Email regex Successfull");
            if (request.body.password.trim().match(regPassword)) {
                console.log("Password regex Successfull");
            }
            else{
                flag = 3;//denotw that Password regex failed
                console.log("Password regex unsuccessfull");
            }
        }
        else{
            flag = 2;//denotw that Email regex failed
            console.log("Email regex unsuccessfull");
        }
    }
    else{
        flag = 1;//denotw that Name regex failed
        console.log("Name regex unsuccessfull");
    }
    return flag;
}

function regexChecknoEmail(request)
{
    var flag = 0;
    if (request.body.name.trim().match(regEXname)){
        console.log("Name regex Successfull");
            if (request.body.password.trim().match(regPassword)) {
                console.log("Password regex Successfull");
            }
            else{
                flag = 3;//denotw that Password regex failed
                console.log("Password regex unsuccessfull");
            }
       }
       else{
            flag = 1;//denotw that Name regex failed
            console.log("Name regex unsuccessfull");
        }
    return flag;
}

////////

app.listen(3000,() => {
    console.log("On port 3000");
})