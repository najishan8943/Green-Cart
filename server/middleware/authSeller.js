import jwt from 'jsonwebtoken'
import 'dotenv/config'


const authSeller = async (req, res,next)=>{
     const {sellerToken} = req.cookies;
     if(!sellerToken){
        return res.json({status:false, message:'Not Authorized'})
     }

     try {
        const tokenDecode = jwt.verify(sellerToken,process.env.SecKey)
        if(tokenDecode.email === process.env. SELLER_EMAIL){
        next()
        }else{
         return res.json({status:false, message:'Not Authorized'})
 
        }
     } catch (err) {
       return res.json({status:false, message:err.message})
 
     }
}

export default authSeller
