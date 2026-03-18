const mongoose = require("mongoose");

const uri = "mongodb+srv://xaviermajorproject2025_db_user:Ajay12345678@cluster0.4iojuvz.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
  process.exit(0);
})
.catch(err => {
  console.error("❌ Connection Failed:", err.message);
  process.exit(1);
});