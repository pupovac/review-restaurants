import mongoose from "mongoose";

export class DbConnection {
  public static async initConnection() {
    process.env.DB_CONN_STR = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE_NAME}`;
    await DbConnection.connect(process.env.DB_CONN_STR);
    // mongoose.set("debug", true);
  }

  public static async connect(connStr: string) {
    return mongoose
      .connect(connStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASSWORD,
      })
      .then(() => {
        console.log(`Successfully connected to ${connStr}`);
      })
      .catch((error) => {
        console.error("Error connecting to database: ", error);
        return process.exit(1);
      });
  }

  public static setAutoReconnect() {
    mongoose.connection.on("disconnected", () => DbConnection.connect(process.env.DB_CONN_STR!));
  }

  public static async disconnect() {
    await mongoose.connection.close();
  }
}
