import argon from 'argon2'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

//registered user

export const register = async (req, res )=>{
    try{
         const { name, email, password } = req.body

         if( !name || !email || !password){
            return res.json({ message: "Missing Details" , success: false})
         }

         const existingUser = await User.findOne({ email })

         if(existingUser)
            return res.json({ message:"User already exist", success:false})

        const hashedPassword = await argon.hash(password)
        const user = await User.create({ name, email, password:hashedPassword})

        const token = jwt.sign({id:user._id}, process.env.SecKey,{expiresIn:"7d"})
         
        res.cookie('token', token, {
            httpOnly:true,  //prevent JS to access cookie
            secure:process.env.NODE_ENV  === 'production' , //use secure cookie in production
            sameSite :process.env.NODE_ENV  === 'production' ? 'none' : 'strict',
            maxAge:7 * 24 * 60 * 60 * 1000,
        })
        return res.json({ success:true, user: { email:user.email, name: user.name}})

    }catch(err){
        console.log(err.message);
        res.json({ success:false, message: err.message})
        
    }
}


//Login user


export const login =  async (req, res) =>{

    try {
        const { email, password} = req.body

        if(!email || !password)
            return res.json({success:false, message:"Email or Password required"})

        const user = await User.findOne({ email})
         if(!user){
          return res.json({success:false, message:"Invalid email or password"})
         }

         const isMatch = await argon.verify(user.password,password)
         if(!isMatch)
            return res.json({success:false, message:"Password is incorrect"})   
        
         
        const token = jwt.sign({id:user._id}, process.env.SecKey,{expiresIn:"7d"})
         
        res.cookie('token', token, {
            httpOnly:true,  //prevent JS to access cookie
            secure:process.env.NODE_ENV  === 'production' , //use secure cookie in production
            sameSite :process.env.NODE_ENV  === 'production' ? 'none' : 'strict',
            maxAge:7 * 24 * 60 * 60 * 1000,
        })
        return res.json({ success:true, user: { email:user.email, name: user.name}})

    } catch (err) {
        return res.json({success:false, message:err.message})
    }
}


//check Auth

export const isAuth = async ( req, res )=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password")
        return res.json({success:true, user})
        
    } catch (err) {
      return res.json({success:false, message:err.message})

    }
}


//logout user

export const logout = async ( req, res)=>{
    try {res.clearCookie('token',{
            httpOnly:true,  
            secure:process.env.NODE_ENV  === 'production' ,
            sameSite :process.env.NODE_ENV  === 'production' ? 'none' : 'strict',  
    })
    return res.json({success:true, message:"Logged out"})
    
    } catch (err) {
       return res.json({success:false, message:err.message})
    }
}