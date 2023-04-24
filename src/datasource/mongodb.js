import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/simple_db", {
  // autoIndex: false, // Don't build indexes
  // maxPoolSize: 10, // Maintain up to 10 socket connections
  // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // family: 4, // Use IPv4, skip trying IPv
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", UserSchema, "users");

const user = new User({ name: "mike bui", age: 18 });

// user.save();
const mongodbConnection = mongoose.connection;

mongodbConnection.on("error", console.error.bind(console, "connection error: "));
mongodbConnection.once("open", async  function () {
  console.log("Connected successfully");
});

export default mongodbConnection

