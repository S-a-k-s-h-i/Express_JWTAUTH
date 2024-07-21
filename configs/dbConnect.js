import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
    });
    console.log("MongoDb Connected..........");
  } catch (err) {
    console.log("Failed to connect with DB........", err);
  }
};
export default connectDB;
