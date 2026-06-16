import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error("Database Connection Error:", err.message));

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error("MONGODB_URI is not defined in .env");
        return;
    }

    try {
        await mongoose.connect(mongoUri, {
            dbName: "project",
            serverSelectionTimeoutMS: 10000,
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB


// const connectDB = async () => {
//     console.log("URI =", process.env.MONGODB_URI);

//     mongoose.connection.on('connected', () =>
//         console.log("Database Connected")
//     );

//     await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
// };
// export default connectDB;