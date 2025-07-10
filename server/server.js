const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postsRouter = require("./routes/posts"); // ✅ 라우터만 import
const cors = require('cors');
const app = express();

app.use(cors());


dotenv.config();

app.use(express.json());

app.use("/api/posts", postsRouter); // ✅ 라우터 연결

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 8080, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });
