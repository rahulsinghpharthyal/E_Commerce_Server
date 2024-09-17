import OrderDetails from "../../models/order.js";
import Cart from '../../models/Cart.js';
import paypal from "../../helper/paypal.js";


const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payedId,
    } = req.body.orderData;

    console.log(req.body);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price,
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount,
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log('this error from payment', error);
        return res
          .status(500)
          .json({ success: false, message: "Error on creating payment" });
      } else {
        const newlyCreateOrder = new OrderDetails({
          userId,
          cartId,
          cartItems,
          addressInfo,
          paymentMethod,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payedId,
        });
        await newlyCreateOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;
        console.log('this is approval URl', approvalURL);
        return res
          .status(201)
          .json({ success: true, approvalURL, orderId: newlyCreateOrder._id });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error Occur during create a order!" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const{paymentId, payerId, orderId} = req.body;
    let order = await OrderDetails.findById(orderId);
    if(!order){
      return res.status(401).json({success: false, message: 'Order can not be found'})
    }
    order.paymentStatus = 'successful';
    order.orderStatus = 'completed';
    order.paymentId = paymentId;
    order.payerId = payerId;

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();
    return res.status(201).json({success: true, message: 'Order Confirmed'})

  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error Occur during payment!" });
  }
};

export { createOrder, capturePayment };
