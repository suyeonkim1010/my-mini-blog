const express = require("express");
const app = express();
app.use(express.json());

app.post("/api/posts", (req, res) => {
  console.log("✅ Received POST request:", req.body);
  res.json({ message: "Test success!", data: req.body });
});

app.listen(5000, () => {
  console.log("🚀 Test server running on port 5000");
});
