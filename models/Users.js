const mongoose=require('mongoose');
const {isEmail}=require('validator');
const bcrypt=require('bcryptjs');


const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:[true,"Mail zorunlu hacı"],
        unique:true,
        lowecase:true,
        validate:[isEmail,"Lütfen mail adrsinizi doğru gir lan"]
    },
    password:{
        type:String,
        required:true,
        minLength:6
    }

});
userSchema.pre('save',async function (next){
    const salt= await bcrypt.genSalt(10);
    console.log(this.password);
    this.password=await bcrypt.hash(this.password,salt)
    next();
})

userSchema.statics.login=async function(email,password){
    const user=await this.findOne({email});

    if(user){
        const auth=await bcrypt.compare(password,user.password);
        
        if(auth){
            return user;
        }
        throw Error('parola-hatasi')
    }
    throw Error('email-hatasi')

}



const Users=mongoose.model('Users',userSchema);
module.exports=Users;