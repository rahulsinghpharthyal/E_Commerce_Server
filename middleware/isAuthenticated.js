import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log("token is ", req.cookies);
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorised User!",
      });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_CLIENT);
    // console.log('decoded is------>', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised User!",
    });
  }
};

export default isAuthenticated;
