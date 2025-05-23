const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lanternlink';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  block: String
});

const User = mongoose.model('User', userSchema);

app.get('/',(req,res)=>{
  res.send('Lanternlink API is running');
})

app.post('/api/register', async (req, res) => {
  const { username, password, block } = req.body;
  if (!username || !password || !block) {
    return res.status(400).json({ message: "All fields required." });
  }
  try {
    const newUser = new User({ username, password, block });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Registration failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
