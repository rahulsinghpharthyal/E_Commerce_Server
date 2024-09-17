// adding into cart:-

import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
      // 1. Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User Not Found" });
      }
  
      // 2. Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product Not Found" });
      }
  
      // 3. Validate quantity
      if (quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid Quantity" });
      }
    

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }  

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
      return res.status(200).json({success: true, message: 'Item Update in Cart'})
    }
    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Item add into Cart" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed Adding item into cart" });
  }
};

// getAll Cart data:-

const allCartItem = async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "User Not Found" });
      const cartData = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "image title price salePrice",
      });
      if(!cartData) return res.status(404).json({success: false, message: "Cart Not Found!"});
  
      const validItems = cartData.items.filter(productItem=> productItem.productId);
      if(validItems.length < cartData.items.length){
          cartData.items = validItems
          await cartData.save();
      }
      const populateCartItems = validItems.map(item=> ({
          productId: item.productId._id,
          image: item.productId.image,
          title: item.productId.title,
          price: item.productId.price,
          salePrice: item.productId.salePrice,
          quantity: item.quantity,
      }))
  
      return res.status(200).json({success: true, Data: {
          ...cartData._doc,
          items: populateCartItems
      }})
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to get all item in cart" });
    }
  };

// remove from cart:-
const removeToCart = async (req, res) => {
  try {
    const {userId, productId} = req.params;
    if(!userId || !productId) return res.status(400).json({success: false, message: "Invalid data Provided"})

    const cart = await Cart.findOne({userId}).populate({
        path: "items.productId",
        select: "image title price salePrice"
    })
        if(!cart) return res.status(404).json({success: false, message: "Cart Not Found!"});


    cart.items = cart.items.filter(item=> item.productId._id.toString() !== productId)
    await cart.save();
    await Cart.findOne({userId}).populate({
        path: "items.productId",
        select: "image title price salePrice"
    })
    const populateCartItems = cart.items.map((item)=> ({
        productId: item.productId ? item.productId._id: null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : 'Product Not Found',
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ?  item.productId.salePrice : null,
        quantity: item.quantity,
    }));
    return res.status(200).json({success: true, message: 'Item Remove from Cart', Data: {
        ...cart._doc,
        items: populateCartItems
    }})
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed remove item into cart" });
  }
};



// updateCart items
const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = User.findById(userId);
    if (!user || !productId || quantity <= 0)
      return res
        .status(404)
        .json({ success: false, message: "Invalid Data Provided" });

    const cart = await Cart.findOne({userId});
    if(!cart) return res.status(404).json({success: false, message: "Cart Not Found!"});
    const findCurrentProductIndex = cart.items.findIndex(items=> items.productId.toString() === productId);

    if(findCurrentProductIndex === -1){
        return res.status(404).json({success: false, message: 'Cart Item Not Pressent'})
    }
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();
    await cart.populate({
        path: 'items.productId',
        select: "image title price",
    })
    const populateCartItems = cart.items.map((item)=> ({
        productId: item.productId ? item.productId._id: null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : 'Product Not Found',
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ?  item.productId.salePrice : null,
        quantity: item.quantity,
    }))

    return res.status(200).json({success: true, message: "Item Updated", Data: {
        ...cart._doc,
        items: populateCartItems
    }})

  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update item in cart" });
  }
};

export { addToCart, removeToCart, allCartItem, updateCartItem };
