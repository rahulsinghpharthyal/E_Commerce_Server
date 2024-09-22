import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorised User!",
      });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_CLIENT);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Unauthorised User!",
    });
  }
};

export default isAuthenticated;
