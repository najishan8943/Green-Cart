import jwt from 'jsonwebtoken'
import 'dotenv/config'

//seller login

export const loginSeller = async (req, res)=>{
     try{
         const { email, password } = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.SecKey,{expiresIn:"7d"})

        res.cookie('sellerToken', token, {
            httpOnly:true, 
            secure:process.env.NODE_ENV  === 'production' ,
            sameSite :process.env.NODE_ENV  === 'production' ? 'none' : 'strict',
            maxAge:7 * 24 * 60 * 60 * 1000,
        })
        return res.json({success:true, message:"Logged in"})
    }else{
        return res.json({success:false, messgae:"Failed to login"})
    }
     }catch(err){
         return res.json({success:false, messgae:err.message})

     }

}



//check sellerAuth

export const isSellerAuth = async ( req, res )=>{
    try {
        return res.json({success:true, user})
        
    } catch (err) {
      return res.json({success:false, message:err.message})

    }
}


//logout seller
export const sellerLogout = async ( req, res)=>{
    try {res.clearCookie('sellerToken',{
            httpOnly:true,  
            secure:process.env.NODE_ENV  === 'production' ,
            sameSite :process.env.NODE_ENV  === 'production' ? 'none' : 'strict',  
    })
    return res.json({success:true, message:"Logged out"})
    
    } catch (err) {
       return res.json({success:false, message:err.message})
    }
}