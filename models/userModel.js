import mongoose from "mongoose";
import bcrypt from "bcrypt";

const {Schema} = mongoose;

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
},
    {
        timestamps:true,
    }
);
// mongodb veri tabınan kaydedilmeden önce pre metodu kullanılarak password hashlenir
userSchema.pre("save",function(next){
const user=this;

bcrypt.hash(user.password, 10, (err, hash)=>{
  user.password=hash;      // işlem başarılıysa passwordu hashle
  next();                  // kodun devamının çalışması için kullanılır
}); 
});

const User = mongoose.model("User", userSchema);

export default User;