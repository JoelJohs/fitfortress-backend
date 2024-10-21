import mongoose from "mongoose";
import colors from "colors";

const connectDB = (mongoUri) => {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(mongoUri, {})
    .then(() => {
      console.log(colors.green.bold("Connected to MongoDB"));
    })
    .catch((error) => {
      console.log(colors.red.bold("Error connecting to MongoDB: ", error));
      process.exit(1); // Salir del proceso con error 
    });
};

export default connectDB;
