import mongoose from "mongoose";
import colors from "colors";
import fs from "fs";
import path from "path";

const connectDB = (mongoUri) => {
  // filepaths de cute_cat.jpeg
  const pathToCuteCat = path.join(process.cwd(), "config", "cute_cat.jpeg");

  if (!fs.existsSync(pathToCuteCat)) {
    console.log(
      colors.red.bold(
        "Fatal cat error: Recursos vitales están dañados, corruptos o perdidos."
      )
    );
    process.exit(1);
  }

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
