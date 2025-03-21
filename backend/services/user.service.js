import userModel from '../models/user.model.js';


export const createUser=async({
    email,password
})=>{
    if(!email ||!password){
        throw new Error('Email and Password required');
    }

    const hashedPassword = await userModel.hashPassword(password);
    const user=await userModel.create({
        email,
        password:hashedPassword
    });

    return user;
}

export const getAllUsers=async({userId})=>{
    const users=await userModel.find({
        _id:{$ne:userId}
        //This ensures the current user is not included in the result.
    });
    return users;
}    