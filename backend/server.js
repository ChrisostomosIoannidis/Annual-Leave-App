import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {PORT,MONGO_URI} from "./config.js";
import authRoutes from "./routes/auth.js";
import LeaveRoutes from "./routes/leaves.js"

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/leaves",LeaveRoutes);

mongoose
.connect(MONGO_URI)
.then(()=>{
    console.log("MongoDB connected");
    app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));
})
.catch ((err)=> console.error("DB error",err));
