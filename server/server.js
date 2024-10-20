require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("usersDB");
    console.log("Connected to MongoDB");
    
    // Ensure index on deviceFingerprint
    await db.collection('users').createIndex({ deviceFingerprint: 1 }, { unique: true });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();

app.post('/api/users', async (req, res) => {
  const { sessionId, xp, level } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  console.log(`Received request for sessionId: ${sessionId}`);

  try {
    const usersCollection = db.collection('users');
    
    let user = await usersCollection.findOne({ deviceFingerprint: sessionId });
    
    if (user) {
      console.log(`Existing user found: ${user._id}`);
      return res.json({
        userId: user._id,
        exists: true,
        xp: user.xp,
        level: user.level,
        tasksCompleted: user.tasksCompleted
      });
    }

    // If no user found, create new one
    user = {
      _id: new ObjectId(),
      deviceFingerprint: sessionId,
      xp: xp || 0,
      level: level || 1,
      tasksCompleted: 0
    };

    await usersCollection.insertOne(user);
    console.log(`Created new user: ${user._id}`);

    res.json({
      userId: user._id,
      exists: false,
      xp: user.xp,
      level: user.level,
      tasksCompleted: user.tasksCompleted
    });
  } catch (error) {
    if (error.code === 11000) {  // Duplicate key error
      console.log(`Duplicate key error for sessionId: ${sessionId}`);
      const existingUser = await db.collection('users').findOne({ deviceFingerprint: sessionId });
      return res.json({
        userId: existingUser._id,
        exists: true,
        xp: existingUser.xp,
        level: existingUser.level,
        tasksCompleted: existingUser.tasksCompleted
      });
    }
    console.error('Error in user creation/lookup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// User update endpoint
app.put('/api/users/:id', async (req, res) => {
  const { xp, tasksCompleted, level } = req.body;
  
  if (typeof xp !== 'number' || typeof tasksCompleted !== 'number' || typeof level !== 'number') {
    return res.status(400).json({ error: 'Invalid xp, tasksCompleted, or level value' });
  }

  try {
    const usersCollection = db.collection('users');
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.params.id) },  // Convert string to ObjectId
      { $set: { xp, tasksCompleted, level } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof MongoServerError && error.code === 11000) {
      res.status(400).json({ error: 'Duplicate key error' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
// Leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  
  try {
    const usersCollection = db.collection('users');
    const leaderboard = await usersCollection.find()
      .sort({ xp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

      console.log('Leaderboard data:', leaderboard);  // Add this line


    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});