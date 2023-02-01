import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authenticateToken = async (req,res,next) => {
   const token = 
   req.headers["authorization"] && req.headers["authorization"].split("")[1];

   if(!token){   //token yoksa
    return res.status(401).json({
        succeded:false,
        error:"No token available",
    });
   }
   req.user = await User.findById(   // veritabanında ki ilgili user kontrol edilip, doğrulanır 
    jwt.verify(token, process.env.JWT_SECRET).userId
   ); 
   next();
};

export {authenticateToken};