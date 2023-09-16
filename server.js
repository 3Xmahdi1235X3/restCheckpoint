// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); 

dotenv.config({ path: './config/.env' }); // Specify the path to your .env file

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose schema and model in User.js 
const User = require('./models/User');

// Middleware to parse JSON requests
app.use(express.json());


// GET all users
app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // POST: Add a new user
  app.post('/users', async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request' });
    }
  });
  
  // PUT: Edit a user by ID
  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request' });
    }
  });
  
  // DELETE: Remove a user by ID
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndRemove(id);
      res.json(deletedUser);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request' });
    }
  });
  
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
