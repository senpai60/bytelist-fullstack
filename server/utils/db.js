import mongoose from "mongoose";

const DB = process.env.MONGOD_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 20000,
  retryWrites: true,
  authSource: "admin",
};

const connectDB = async function () {
  try {
    await mongoose.connect(DB, options);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err);
  }
};

export default connectDB
