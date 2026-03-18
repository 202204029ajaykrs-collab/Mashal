const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config();

// Connect Database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

app.get('/', (req, res) => {
  res.send('Hello from Mashal Backend!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
