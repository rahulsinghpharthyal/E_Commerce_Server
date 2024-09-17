import Product from "../../models/Product.js";

export const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
    }

    const products = await Product.find(filters).sort(sort);
    return res.status(200).json({ success: true, Data: products });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error on Filter the Product" });
  }
};


export const getProductDetails = async (req, res)=> {
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product) return res.status(404).json({success: false, message: 'Product Not Found'})
        return res.status(200).json({success: true, Data: product})
    }catch(err){
        res.status(500).json({status: false, message: "Error on find the product details"})
    }
}