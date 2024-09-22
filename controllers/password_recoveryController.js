import bcrypt from "bcryptjs";
import { sendEmail } from "../helper/sendMail.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const sendLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Please Provide the email" });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res
        .status(401)
        .json({ success: false, message: "Please Enter Register Email!" });
    }

    const passwordRecoveryToken = jwt.sign(
      { _id: foundUser?._id },
      process.env.PASSWORD_RECOVERY_SECRET,
      { expiresIn: "30m" }
    );
    //create jwt token for password recovery
    const message = `\n Please click on the given link to reset your password.This link is valid only for 30 minutes.
         ${
           process.env.CLIENT_URL1 + "/reset-password/" + passwordRecoveryToken
         }\n\n
        If you have not requested this email then, please ignore it `;
    await sendEmail(email, "Reset Password", message);
    return res
      .status(200)
      .json({ success: true, message: "recovery link sent successFully" });
  } catch (err) {
    console.log("error form send link", err);
    return res
      .status(500)
      .json({ success: false, message: "Error on send the reset link" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { recovery_id } = req.params;
    if (!recovery_id)
      return res
        .status(401)
        .json({ success: false, message: "invalid recovery link" });

    const { password } = req.body;

    const isVeryfy = jwt.verify(
      recovery_id,
      process.env.PASSWORD_RECOVERY_SECRET
    );

    const foundUser = await User.findOne({ _id: isVeryfy?._id });
    if (!foundUser)
      return res.status(401).json({ success: false, message: "Invalid User" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const status = await User.updateOne(
      { _id: foundUser?._id },
      { password: hashedPassword }
    );

    return res
      .status(200)
      .json({ success: true, message: "password updated successfully..." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "link expired" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error on resest the Password" });
  }
};

export { sendLink, ResetPassword };
