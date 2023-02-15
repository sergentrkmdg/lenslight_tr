import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Photo from "../models/photoModel.js";

const createUser = async(req, res)=>{

    try {  
        const user = await User.create(req.body);   
        res.status(201).json({user:user._id});  
        
        //res.redirect("/login");  // kullanıcı oluşturulduğunda login sayfasına yönlendirir
        
    } catch (error) {
        
        let errors2 = {};

        if(error.code === 11000) {
            errors2.email="The Email is already register"
        }

        if(error.name === "ValidationError"){
            Object.keys(error.errors).forEach((key) => {
                errors2[key]=error.errors[key].message;
            });
        }
        
        res.status(400).json(errors2);   
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
const getDashboardPage= async (req, res)=>{
    const photos = await Photo.find({user:res.locals.user._id});
    const user = await User.findById({_id:res.locals.user._id}).populate([
        "followings",
        "follower"
    ]);
    res.render("dashboard", {
        link:"dashboard",
        photos,
    });
};
const getAllUsers = async (req, res) =>{
    try {
        const users = await User.find({_id: {$ne:res.locals.user._id} }); // o an localdeki kullanıcının idsine eşit olmayan kullanıcıları getir.Yani kullınıcı hariç diğer idler gelecek 
        res.status(200).render("users", {
            users,
            link:"users",
        });
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }
};
const getAUser = async (req, res) =>{
    try {
        const user = await User.findById({_id:req.params.id}); // urlde ki id almamamızı sağlar
        const photos = await Photo.find({user:user._id}); // tıklanan userin fotoları olacak
        res.status(200).render("user", {
            user,
            photos,
            link:"users",
        });
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }
};
const follow = async (req, res) =>{
    try {
      let user= await User.findByIdAndUpdate(  //takip edeceğim ya da takipten çıkacağım kullanıcı
      {_id:req.params.id}, 
      {$push:{followers:res.locals.user._id}}, // followers alanına o an ki kullanıcıyı ekle
      {new:true} // ekledikten sonra yeni useri dön
      );
        user = await User.findByIdAndUpdate (
        {_id:res.locals.user._id},
        {$push:{following:req.params.id}}, 
        {new:true}
        );
        res.status(200).json({
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

const unfollow = async (req, res) =>{
    try {
      let user= await User.findByIdAndUpdate(  //takip edeceğim ya da takipten çıkacağım kullanıcı
      {_id:req.params.id}, 
      {$pull:{followers:res.locals.user._id}}, // followers alanına o an ki kullanıcıyı ekle
      {new:true} // ekledikten sonra yeni useri dön
      );
        user = await User.findByIdAndUpdate (
        {_id:res.locals.user._id},
        {$pull:{following:req.params.id}}, 
        {new:true}
        );
        res.status(200).json({
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

export {createUser, loginUser, getDashboardPage, getAllUsers, getAUser, follow, unfollow}; 