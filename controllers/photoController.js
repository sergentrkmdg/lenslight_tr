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
        image_id:result.public_id,

    });
     
    fs.unlinkSync(req.files.image.tempFilePath);
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
        
        let isOwner = false;

        if(res.locals.user) {
        isOwner = photo.user.equals(res.locals.user._id); // giriş yapan kullanıcı foto sahibiyle aynıysa true döner
        }
        
        res.status(200).render("photo", {
            photo,
            link:"photos",
            isOwner,
        });
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }
};
const deletePhoto = async (req, res) =>{
    try {
        const photo = await Photo.findById(req.params.id); // foto seçildi
        const photoId = photo.image_id;  // image_id propertiesi alındı

        await cloudinary.uploader.destroy(photoId); // cloudinaryden foto silindi
        await Photo.findOneAndRemove({_id:req.params.id});
        res.status(200).redirect("users/dashboard");

    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }
};
const updatePhoto = async (req, res) =>{
    try {
      const photo = await Photo.findById(req.params.id);

      if(req.files){ // yüklenen dosya varsa 
        const photoId=photo.image_id; 
        await cloudinary.uploader.destroy(photoId); // photoyu sil

        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,  // yeni foto yükle
            {
              use_filename: true,
              folder: 'lenslight_tr',
            }
          );
      
          // idler değişir
          photo.url = result.secure_url;    
          photo.image_id = result.public_id;
      
          fs.unlinkSync(req.files.image.tempFilePath); // geçici temp dosyasını siler
        }
        
        //yüklenen foto yoksa ve sadece name ile description güncellenecek ise
        photo.name = req.body.name;
        photo.description = req.body.description;

        photo.save();

        res.status(200).redirect(`/photos/${req.params.id}`); 

    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
        });
    }
};
export {createPhoto, getAllPhotos, getAPhoto, deletePhoto, updatePhoto};