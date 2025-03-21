import mongoose from "mongoose";
async function connect() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/testapp4", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit the process if the database connection fails
    }
}

export default connect;
