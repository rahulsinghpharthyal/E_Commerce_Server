import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//register

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.json({ success: false, message: "Email already Registered" });

    const existingUserName = await User.findOne({ userName });
    if (existingUserName)
      return res.json({
        success: false,
        message: "UserName already register, Please create other userName",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      userName,
      email,
      password: hashPassword,
    });
    // console.log(newUser);
    return res
      .status(200)
      .json({ success: true, message: "Registration Successfull" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Some error occured" });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please Signup for login.",
      });

    const cheackPaswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!cheackPaswordMatch)
      return res.json({ success: false, message: "Invalid Password" });

    const payload = {
      id: existingUser._id,
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_CLIENT, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .json({
        success: true,
        message: "Logged in Successfully",
        Data: {
          id: existingUser._id,
          userName: existingUser.userName,
          role: existingUser.role,
          email: existingUser.email,
          token: token,
        },
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Some error occured" });
  }
};

// logout

const logoutUser = async (req, res) => {
  const token = await req;
  try{
    if(token){

      res
      .clearCookie("token", {
        httpOnly: true,
        secure: false,
        path: '/'
      })
      .json({
        success: true,
        message: "Logged out Successfully!",
      });
    }
    }catch(err){
      res.status(500).json({success: false, message: err.message})
    }
};

// auth middleware

export { registerUser, loginUser, logoutUser };
