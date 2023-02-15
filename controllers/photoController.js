import Photo from "../models/photoModel.js";
import { v2 as cloudinary} from "cloudinary";
import fs from "fs";

const createPhoto = async(req, res)=>{
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,  // urlde ki resim için geçici temp dosyası tutar
        {
          use_filename: true,
          folder: 'lenslight_tr',
        }
      );
    
    try { 
    await Photo.create({
        name:req.body.name,
        description:req.body.description,
        user:res.locals.user._id,
        url:result.secure_url,

    });
     
    fs.linkSync(req.files.image.tempFilePath);
    res.status(201).redirect("/users/dashboard"); 
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }    
};

const getAllPhotos = async (req, res) =>{
    try {
        const photos =res.locals.user  
        ? await Photo.find({user:{$ne:res.locals.user._id}}) // user alanında o an giriş yapan kullanıcı olmayacak
        : await Photo.find({}); // user yoksa filtreleme yapma 
        res.status(200).render("photos", {
            photos,
            link:"photos",
        });
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }
};
const getAPhoto = async (req, res) =>{
    try {
        const photo = await Photo.findById({_id:req.params.id}).populate("user"); // photo üzerinden usera gidilebilir
        res.status(200).render("photo", {
            photo,
            link:"photos",
        });
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }
};

export {createPhoto, getAllPhotos, getAPhoto};