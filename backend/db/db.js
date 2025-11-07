import mongoose from "mongoose";
async function connect() {
    try {
        await mongoose.connect("mongodb+srv://spyspring30_db_user:Ib2dgkr3UfDjM0kw@cluster0.ujeduvy.mongodb.net/", {
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
