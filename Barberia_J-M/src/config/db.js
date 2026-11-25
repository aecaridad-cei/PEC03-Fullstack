import mongoose from "mongoose";

let connectionPromise;

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    throw new Error("Falta configurar la variable de entorno MONGODB_URI.");
  }
  if (!/^mongodb(?:\+srv)?:\/\//.test(mongoUri)) {
    throw new Error("MONGODB_URI debe comenzar por mongodb:// o mongodb+srv://.");
  }

  if (mongoose.connection.readyState === 0) {
    connectionPromise = undefined;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  return connectionPromise;
}
