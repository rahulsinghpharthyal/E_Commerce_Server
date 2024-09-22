import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

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


// login with google 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload(); // Returns user info
};

// Google Login Handler
  const googleLogin = async (req, res) => {
  const { token } = req.body;
  // console.log('tis is token', token);
  try {
    // Verify the token and get user info
    const googleUser = await verifyGoogleToken(token);
    console.log(googleUser);
    // Check if the user exists in the database
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // If not, create a new user
      user = new User({
        googleId: googleUser.sub,
        email: googleUser.email,
        userName: googleUser.name,
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const jwtToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_CLIENT, {
      expiresIn: '1h',
    });

    return res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: false,
      }).json({
      success: true,
      message: 'Login successful',
      Data: {
        id: user._id,
        userName: user.userName,
        role: user.role,
        email: user.email,
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error('Error during Google login', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid Google token',
    });
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

export { registerUser, loginUser, logoutUser, googleLogin};
