const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ensure this is added
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve static files like CSS

// Serve login.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  block: String
}));

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, block } = req.body;
  if (!username || !password || !block) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = new User({ username, password, block });
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

