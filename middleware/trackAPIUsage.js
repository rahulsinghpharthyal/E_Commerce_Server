import ApiUsage from "../models/apiUsage.js";


const trackAPIUsage = async (req, res, next) => {
  try{
    await ApiUsage.create({
      endpoint: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
    })
    // console.log(`Logged ${req.method} request to ${req.originalUrl} from ${req.ip} and ${newUsage}`);
  }catch(error){
    console.error('Error logging API usage:', error);
  }
  next();
};

export default trackAPIUsage;