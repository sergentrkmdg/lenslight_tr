import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async(req, res)=>{

    try { 
        const user = await User.create(req.body); 
          res.status(201).json({
        succeded:true,
        user, 
    });
        
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }    
};
const loginUser = async(req, res)=>{

  
    try { 
        const {username, password}= req.body; // formdan gelen bilgiler

        const user = await User.findOne({username}); // database den  gelen bilgiler

        let same=false;

        if(user){  //user varsa yani kullanıcılar uyuşuyorsa
            same= await bcrypt.compare(password, user.password);
        }
        else{ //kullanıcı bulunmuyorsa 
          return  res.status(401).json({  // return ? kullanıcı yoksa sonra ki aşamaya geçip şifre kontrol etmesine gerek yok
                succeded:false,
                error:"There is no such user",
            });
        }

        if(same) { //user varsa ve şifrelerde eşleşiyorsa

          const token =  createToken(user._id) // token oluştur / // o an giriş yapan kullanıcının id'si alınır kontrol edilmek için
          res.cookie("jwt", token, {  // token jwt olarak cookiye kaydediliyor
            httpOnly:true, // FE tarafından istek alınabilir
            maxAge:1000*60*60*24,
          });
            res.redirect("/users/dashboard"); // giriş yaptıktan sonra yönlendir.
        }else {
            res.status(401).json({
                succeded:false,
                error:"Password are not matched",               
            });
        }
        
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }    
};
const createToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
const getDashboardPage=(req, res)=>{
    res.render("dashboard", {
        link:"dashboard",
    });
};

export {createUser, loginUser, getDashboardPage}; 