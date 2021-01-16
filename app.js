const express = require('express');
const mongoose = require('mongoose');
const cros = require('cors');
const dotenv = require('dotenv')
const authRoutes =require('./routes/authRoutes');
const cookieParser=require('cookie-parser');
const {authKontrol,kullaniciKontrol}=require('./middleware/authMiddleware')

//env secret
dotenv.config();
const app = express();

// view yolu
app.use(express.static('public'))
//json
app.use(express.json());
// isstekler için
app.use(cookieParser());

//Front end
app.set('view engine', 'ejs')
//PORT TANIMI
const PORT = process.env.PORT || 5001;
//db connect
mongoose
    .connect(process.env.dbURI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(PORT, () => {
            console.log(`Veri tabanına bağlandı ve sunucu ${PORT} da çalışıyor`)
        })

    }).catch((err) => {
        console.log(err);
    })
    //request
    app.get('*',kullaniciKontrol)
    app.get('/',authKontrol,(req,res)=>{
      
        res.render('home');
    })
    app.get('/works',authKontrol,(req,res)=>{
        res.render('works');
    })
    app.use(authRoutes);

    // app.get('/get-cookie',(req,res)=>{
    //      let cookie=req.cookies;
    //      res.json(cookie);
    // })



