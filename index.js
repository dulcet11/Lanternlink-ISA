
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('Lanternlink backend is running');
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lanternlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  block: String
}));

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
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
