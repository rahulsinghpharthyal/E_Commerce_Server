import OrderDetails from "../../models/order.js";
import paypal from "../../helper/paypal.js";
import { sendInvoice } from "../../helper/sendMail.js";

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
      payerId,
    } = req.body.orderData;

    // console.log(req.body);
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

    // console.log(create_payment_json, 'create_payment_json');
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        // console.log('this error from payment', error);
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
          payerId,
        });
        await newlyCreateOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;
        // console.log('this is approval URl', approvalURL);
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
    const { paymentId, payerId, orderId } = req.body;
    if (!orderId || !paymentId || !payerId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: orderId, paymentId, or payerId",
      });
    }
    let order = await OrderDetails.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order cannot be found" });
    }
    order.paymentStatus = "completed";
    order.orderStatus = "successful";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();
    return res.status(201).json({
      success: true,
      message: "Order confirmed, invoice sent!",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error Occur during payment!" });
  }
};

const invoiceGenerate = (req, res) => {
  try {
    const { cartItems, userEmail, totalCartAmount } = req.body;
    const invoice = {
      merchant_info: {
        email: "rahulpharthyal04@gmail.com",
        business_name: "E-commerce",
        phone: {
          country_code: "001",
          national_number: "03464646",
        },
        address: {
          line1: "Germaine Pass",
          city: "East Braxton",
          state: "Connecticut",
          postal_code: "504768",
          country_code: "US",
        },
      },
      billing_info: [
        {
          email: userEmail, // Customer's email from addressInfo
        },
      ],
      items: cartItems?.map((item) => ({
        name: item.title,
        quantity: item.quantity,
        unit_price: {
          currency: "USD",
          value: totalCartAmount,
        },
      })),
      note: "Thank you for your purchase!",
      terms: "No refunds after 30 days.",
      total_amount: {
        currency: "USD",
        value: 300,
      },
    };

    paypal.invoice.create(invoice, async (invoiceError, invoiceInfo) => {
      if (invoiceError) {
        console.error("Error creating invoice:", invoiceError);
        return res.status(500).json({
          success: false,
          message: "Error occurred while creating the invoice",
        });
      } else {
        return res.status(201).json({
          success: true,
          messsage: "Invoice Generated",
          Data: invoiceInfo,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error on Generating Invoice" });
  }
};

const sendInvoiceEmail = async (req, res) => {
  try {
    const { userEmail, invoice } = req.body;
    if (!userEmail || !invoice)
      return res.status.jaon({
        success: false,
        message: "Please proivde all details",
      });

    await sendInvoice(userEmail, "Your Invoice", invoice);
    return res.status(200).json({success: true, message: 'Inovice Send to Your mail'})
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "error on sending mail" });
  }
};

export { createOrder, capturePayment, invoiceGenerate, sendInvoiceEmail };
