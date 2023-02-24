const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

const {userModel} = require("../models/user")


userRouter.get("/",(req,res)=>{
    res.send("data");
})

userRouter.post("/register",async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        bcrypt.hash(password,5, async (err,hash) =>{
            if(err){
                res.send({"msg":err.message})
            }else{
                const data = new userModel({name,email,password:hash});
                await data.save();
                res.send({"msg":"data is saved"})
            }
        })
    }catch(err){
        res.send({"msg":err.message});
    }

})


userRouter.post("/login", async (req, res) => {
    const { email, password } = (req.body);
    try {
        const user = await userModel.find({ email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: user[0]._id }, "masai", { expiresIn: "3600s" })
                    res.send({ "msg": "Logged In ", "token": token });
                } else {
                    res.send({ "msg": "Wrong credentials" });
                }
            });

        } else {
            res.send({ "msg": "Wrong credentials" });
        }
    } catch (error) {
        res.send({ "msg": "New user Unable to  Logged In", "error": error.message });
    }


})


module.exports = {
    userRouter
}






