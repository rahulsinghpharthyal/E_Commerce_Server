import mongoose from "mongoose";

const Connection = async () => {
    try{
        const MONGO_URL = process.env.MONGO_URL;
        const data = await mongoose.connect(MONGO_URL)
        console.log(`Mongodb connected with server : ${data.connection.host}`);
    }catch(err){
        console.log(`Error while connecting with database`, err.message)
    }

}

export default Connection;