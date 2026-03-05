//place order COD

import Order from "../models/Order.js"
import Product from "../models/Product.js"

export const placeOrderCOD = async (req, res) =>{
    try {
     const userId = req.userId
    const { items, address} = req.body
    if( !address || !items || items.length === 0){
        return res.json({ success:false, message:"Invalid data"})
    }

    //Calculate Amount using item

    let amount = 0;
    for (const item of items) {
    const product = await Product.findById(item.product);

      if (!product) continue;
        amount += product.offerPrice * item.quantity;
    }
    //Add Tax charge

    amount += Math.floor(amount * 0.02)

    await Order.create({
        userId,
        items,
        amount,
        address,
        paymentType: "COD"
    })
    return res.json({success:true, message:"Order Placed"})
} catch (err) {
     return res.json({ success:false, message:err.message})

}}



//get orders by userid

export const getUserOrders = async ( req, res)=>{
    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product").populate("address").sort({createdAt: -1})
       return res.json({success:true, orders })

    } catch (err) {
      return res.json({ success:false, message:err.message})

    }
}

//get all orders

export const getAllOrders = async ( req, res)=>{
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product").populate("address").sort({createdAt: -1})
       return res.json({success:true, orders })

    } catch (err) {
      return res.json({ success:false, message:err.message})

    }
}