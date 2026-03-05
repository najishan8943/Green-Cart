import jwt from 'jsonwebtoken'
import 'dotenv/config'

const authUser = async (req, res, next) =>{

    const { token } = req.cookies;

    if(!token){
        return res.json({ success:false, message:"Not Authorized"})
    }

    try {
        const tokenDecode = jwt.verify(token,process.env.SecKey)
        if(tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            return res.json({ success:false, message:"Not Authorized"})
        }
        next()
        
    } catch (err) {
        return res.json({status:false, message:err.message})
    }
}


export default authUser