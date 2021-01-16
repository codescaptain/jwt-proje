const jwt = require('jsonwebtoken');
const User = require ('../models/Users')
const authKontrol = (req, res, next) => {

    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, (err, result) => {
            if (err) {
                //console.log(err.message);
                res.redirect('/login');
            } else {
                //console.log(result);
                next();
            }

        })

    } else {
        res.redirect('/login');
    }
}

const kullaniciKontrol=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.SECRET_TOKEN,async(err,result)=>{
            if(err){
               // console.log(err.message);
                res.locals.user=null;
                next();


            }else{
                let user=await User.findById(result.id);
                res.locals.user=user;
                console.log(res.locals.user);
                next();
            }
        })
    }else{
        res.locals.user=null;
        next()
    }


}

module.exports={authKontrol,kullaniciKontrol}