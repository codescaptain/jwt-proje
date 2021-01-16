const Users = require('../models/Users')
const jwt = require('jsonwebtoken');

const hata = (err) => {
    let errors = { email: '', password: '' }
    if (err.code === 11000) {
        errors.email = "Bu mail adresi veri tababnında bulunuyor";
        
    }

    if(err.message==='email-hatasi'){
        errors.email='mail yanlış hacı'
    }
    if(err.message==='parola-hatasi'){
        errors.email='paralo yanlış hacı'
    }
    return errors;

}

const maxAge = 1000 * 60 * 60 * 24 * 3;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_TOKEN, {
        expiresIn: maxAge
    })
}


module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    //todo validation ekle
    const { email, password } = req.body;
    try {
        const user = await Users.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge })
        res.status(200).send(user);
    } catch (error) {
        // res.status(400).send('kullanici oluşturma hatası'+ error);
        const errors = hata(error);
        res.status(400).send({ errors });

    }
}
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password)
    // res.send('kullanıcı giriş')
    try {
        const user = await Users.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
        res.status(200).send({ user: user._id });

    } catch (error) {
        const errors=hata(error);
        res.status(400).send({errors})

    }

}

module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','cikis yapildi',{maxAge:1});
    res.redirect('/login')

}