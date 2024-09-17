import { imageUploadUtils } from "../../helper/cloudinary.js";
import Product from "../../models/Product.js";

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    // console.log('this is b64', b64);
    const url = `data:${req.file.mimetype};base64,${b64}`;
    // console.log('this is url', url);
    const result = await imageUploadUtils(url);

    return res.json({
      success: true,
      message: "Image Uploaded successfully",
      result: result,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//  add new product:-

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newProduct = await Product.create({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      Data: newProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      massage: "Error Occured",
    });
  }
};

// fetch all products:-

const getAllProducts = async (req, res) => {
  try {
    const allProduct = await Product.find({});
    return res
      .status(201)
      .json({ success: true, message: "All Product here", Data: allProduct });
  } catch (err) {
    return res.status(500).json({
      success: false,
      massage: "Error Occured",
    });
  }
};

// update a product:-

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    return res
      .status(200)
      .json({
        success: true,
        message: "Product Updated Successfully",
        Data: updatedProduct,
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      massage: "Error Occured",
    });
  }
};

// delete a product:-

const deleteProductById = async (req, res) => {
  try {
    const {id} = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    if(!deleteProduct) return res
    .status(404)
    .json({ success: false, message: "Product Not Found" });
    return res.status(200)
    .json({
      success: true,
      message: "Product Deleted Successfully",
      Data: deleteProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      massage: "Error Occured",
    });
  }
};

export {
  handleImageUpload,
  addProduct,
  getAllProducts,
  updateProductById,
  deleteProductById,
};
