import User from "../models/userModel.js";
import jwt from "jsonwebtoken";


const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken)=>{

            if(err){
                console.log(err.message);
                res.locals.user=null;
                next();
            }else{
                const user = await User.findById(decodedToken.userId);
                res.locals.user = user; // localdeki kullanıcı bu kullanıcıya eşit
                next();
            }

        })
    }else{
        res.locals.user=null;
        next();
    }
}




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
 
  

export {authenticateToken, checkUser};