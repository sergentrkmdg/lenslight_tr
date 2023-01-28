import express from "express";

const app = express()
const port = 3000

app.get("/", (req, res)=>{
    res.send("İndex sayfası 2")
})

app.listen(port, ()=>{
    console.log(`Uygulama bu portta başlatilacak port:${port}`);
})