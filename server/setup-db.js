const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

console.log('Removing existing database...');
try {
  fs.unlinkSync('./users.db');
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.error('Error removing database:', err);
  }
}

console.log('Creating new database...');
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
});

console.log('Creating tables...');
db.serialize(() => {
  db.run(`CREATE TABLE users (
    id TEXT PRIMARY KEY,
    deviceFingerprint TEXT UNIQUE,
    xp INTEGER DEFAULT 0,
    tasksCompleted INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      process.exit(1);
    }
    console.log('Users table created successfully');
    console.log('Database setup completed successfully');
    db.close();
  });
});