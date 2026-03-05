import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";


//get product
export const addProduct = async (req, res)=>{
  try {
    let productData = JSON.parse(req.body.productData)

    const images = req.files

    let imagesUrl = await Promise.all(
        images.map(async (item)=>{
            let result = await cloudinary.uploader.upload(item.path,
                {resource_type: 'image'});
                return result.secure_url
        })
    )

    await Product.create({...productData, image: imagesUrl})
    res.json({ success:true, message: "Product Added"})
  } catch (err) {
    return res.json({ success:false, message:"Failed to add products"})
  }
}


//get product
export const productList = async (req, res)=>{
     try {
        const products = await Product.find({})
        return res.json({success:true, products})
     } catch (err) {
      return res.json({ success:false, message:err.message})
 
     }
}




//get single-product
export const productById = async (req, res)=>{
   try {
    const { id } = req.body;

    const product = await Product.findById(id)
     return res.json({status:true, product})
   } catch (err) {
     return res.json({ success:false, message:err.message})

   }
}



//change product-stock
export const changeStock = async (req, res)=>{
    try{
        const { id,inStock } = req.body;
        await Product.findByIdAndUpdate(id, {inStock})
        return res.json({success:true, message:"Stock Updated"})

    }catch(err){
       return res.json({ success:false, message:err.message})
 
    }
}