import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"));

    await mongoose.connect(`${process.evn.MONGODB_URI}/project`)
};

export default connectDB