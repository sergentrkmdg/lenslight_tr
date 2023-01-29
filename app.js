import express from "express";
import dotenv from "dotenv";
import conn from "./db.js";
import pageRoute from "./routes/pageRoute.js";

dotenv.config();

//connection to the DB
conn();

const app = express();
const port = process.env.PORT;

// ejs template engine

app.set('view engine', 'ejs');




// statik dosyalarımız
app.use(express.static('public'));

//routes
app.use("/",pageRoute);

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