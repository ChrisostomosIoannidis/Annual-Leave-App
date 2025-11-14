import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"
import { JWT_SECRET } from "../config.js";

const router=express.Router();

router.post("/seed-admin",async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const passwordHash=await bcrypt.hash(password,10);
        const admin=await User.create({
            name,email,
            passwordHash,
            role:"admin",
            annualLeaveDays:25,
        });
        res.json(admin);
    } catch (err){
        res.status(400).json({message:err.message});
    }
});

router.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const user=await User.findOne({email});

    if(!user) return res.status(400).json({message:"Invalid credentials"});

    const match=await bcrypt.compare(password,user.passwordHash);
    if (!match) return res.status(400).json({message:"Invalid credentials"});

    const token=jwt.sign({id:user._id,role:user.role},JWT_SECRET,{
        expiresIn:"8h",
    });

    res.json({
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            annualLeaveDays:user.annualLeaveDays,
        },
    });
});

export default router;