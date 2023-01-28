import mongoose from "mongoose";

const conn=()=>{ 
    mongoose.
    connect(process.env.DB_URI, {
        dbName:"lenglesth_tr",
        useNewUrlParser:true,
        useUnifiedTopology:true    
    }).then(()=>{
        console.log( "DB yükleme başarılı");

    }).catch((err)=>{
        console.log(`DB yükleme başarısız hata:, ${err}`);
    });
};

export default conn;