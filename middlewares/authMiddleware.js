import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authenticateToken = async (req,res,next) => {
   try{ 
    const token = req.cookies.jwt;  // token cookiden alındı
   
   if(token){
    jwt.verify(token, process.env.JWT_SECRET, (err)=>{
        if(err){
            console.log(err.message);
            res.redirect("/login"); //hata varsa logine geri dön
        }else{
            next(); 
        }
    });
   }else {
    res.redirect("/login"); // token yoksa da logine geri dön
   }
}  catch (error) {
    res.status(401).json({
        succeded:false,
        error:"Not authorized",
    });
} 
 
};
 
  

export {authenticateToken};