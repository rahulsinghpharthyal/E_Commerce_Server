import User from "../models/User.js";

const authenticate = async (req, res) => {
  //   console.log(req.user);
  try {
    const { id } = req.user;
    // console.log('this is id', id);
    const foundUser = await User.findOne({ _id: id });
    if (!foundUser)
      return res.json({
        success: false,
        message: "Invalid Username and Password!",
      });
    res
      .status(200)
      .json({ success: true, message: "Authenticated User!", Data: foundUser });
  } catch (err) {
    return res
      .status(500)
      .json({ sucess: false, message: "Authentication Failed" });
  }
};

export default authenticate;
