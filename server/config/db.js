import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB: ", err);
  }
};

export default connectDB;
