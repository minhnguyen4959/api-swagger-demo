import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const connect = async() => {
    try {
        let connection = await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connect DB successfully");
        return connection;
      } catch (error) {
        console.log("Connect DB failed: " + error);
      }
}
 
export default connect;