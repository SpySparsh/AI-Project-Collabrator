import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        minLength:[6,'Atleast 6 characters'],
        maxLength:[50,'Atmost 50 characters']
    },

    password:{
        type:String, 
        select:false //cannot be selected to be showed at frontend
    }

})

userSchema.statics.hashPassword=async function (password){
    return await bcrypt.hash(password,10);
    //10 bar run karega hash ke liye 1 password ko
}

userSchema.methods.isValidPassword=async function(password){
    return await bcrypt.compare(password,this.password);
    //this.password is hashed password
    //password is plane password and is compared by bcrypt if they are same
}

userSchema.methods.generateJWT=function(){
    return jwt.sign({email:this.email},process.env.JWT_SECRET,{
        expiresIn:'24h'  //24 hour ka time token expire hai
    });
    //create token based on email
}

const User=mongoose.model('User',userSchema);

export default User;