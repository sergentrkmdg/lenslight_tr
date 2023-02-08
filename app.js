import express from "express";
import dotenv from "dotenv";
import conn from "./db.js";
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js";
import photoRoute from "./routes/photoRoute.js";
import userRoute from "./routes/userRoute.js";
import { checkUser } from "./middlewares/authMiddleware.js";
dotenv.config();

//connection to the DB
conn();

const app = express();
const port = process.env.PORT;

// ejs template engine

app.set('view engine', 'ejs');




// statik dosyalarımız
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
//routes
app.get("*", checkUser);
app.use("/",pageRoute);
app.use("/photos", photoRoute);
app.use("/users", userRoute);

//routes işlemleri diğer yöntem
/* app.get("/", (req, res)=>{
    res.render("index")
})
app.get("/about", (req, res)=>{
    res.render("about")
}) */

app.listen(port, ()=>{
    console.log(`Uygulama bu portta başlatilacak port:${port}`);
})