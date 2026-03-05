import Address from "../models/Address.js";

// Add Address 
 
export const addAddress = async (req, res)=>{
    try {
        const userId = req.userId;
        const { address } = req.body;
        await Address.create({ ...address, userId})
        return res.json({ success:true, message:"Address Added"})
    } catch (error) {
        return res.json({ status:false, message:error.message })
    }
}


//get Address

export const getAddress = async (req, res)=>{
    try {
        const  userId  = req.userId
        const addresses = await Address.find({userId})
        return res.json({ success:true, addresses})

    } catch (err) {
      return res.json({ status:false, message:err.messsage })
   
    }
}