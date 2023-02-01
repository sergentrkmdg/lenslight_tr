import User from "../models/userModel.js";
import bcrypt from "bcrypt";

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

            res.status(200).send("You are loggend in") ;
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

export {createUser, loginUser};