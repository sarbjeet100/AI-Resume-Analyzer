import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(`
=================================================
✅ MongoDB Connected Successfully
📦 Database : ${connection.connection.name}
🌐 Host     : ${connection.connection.host}
=================================================
`);
  } catch (error) {
    console.error(`
=================================================
❌ MongoDB Connection Failed
${error.message}
=================================================
`);

    process.exit(1);
  }
};

export default connectDB;