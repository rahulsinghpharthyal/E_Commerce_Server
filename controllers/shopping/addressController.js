import UserAddress from "../../models/address.js";

// Add the Address
const addAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const { address, city, pincode, phone, notes } = req.body.formData;
    console.log('this is userId', req.body);
    if ((!userId, !address, !city, !pincode, !phone, !notes))
      return res
        .status(401)
        .json({ success: false, message: "Invalid Data Please fill the data" });
    const newAddress = await UserAddress.create({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });
    // console.log(newAddress);
    res.status(201).json({ success: true, Data: newAddress, message: 'Address Added Successfully' });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "Error on Adding Address" });
  }
};

// get all the Address
const getAllAddress = async (req, res) => {
  try {
    const  { userId } = req.params;
    // console.log(userId);
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "UserId is required" });
    const addressList = await UserAddress.find({ userId });

    return res.status(200).json({ success: true, Data: addressList });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: true, message: "Error on getting all Address" });
  }
};

// update the Address
const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { formData }= req.body;
    console.log('this is form data updat', formData);
    if ((!userId, !addressId))
      return res
        .status(401)
        .json({ success: false, message: "User and Address id is required!" });

    const address = await UserAddress.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true }
    );
    console.log('this is updated address ', address);

    if (!address)
      return res
        .status(404)
        .json({ succes: false, message: "Address Not Found!" });
    return res.status(200).json({ success: true, Data: address, message: "Address Updated Succesfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "Error on updating Address" });
  }
};

// delete the Address
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if ((!userId, !addressId))
      return res
        .status(401)
        .json({ success: false, message: "User and Address id is required!" });

    const address = await UserAddress.findOneAndDelete({
      _id: addressId,
      userId,
    });
    if (!address)
      return res
        .status(404)
        .json({ succes: false, message: "Address Not Found!" });
    return res.status(200).json({ success: true, message:'Address Delted Succesfull', Data: address });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "Error on deleting Address" });
  }
};

export { addAddress, getAllAddress, updateAddress, deleteAddress };
