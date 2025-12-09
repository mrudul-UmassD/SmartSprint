const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUserData = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartsprint';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB\n');

        const users = await User.find({ 
            $or: [
                { username: 'admin' },
                { username: 'pm1' },
                { username: 'pm2' }
            ]
        });

        users.forEach(user => {
            console.log(`Username: ${user.username}`);
            console.log(`Role: ${user.role}`);
            console.log(`Team: ${user.team}`);
            console.log(`Level: ${user.level}`);
            console.log(`Team value type: ${typeof user.team}`);
            console.log(`Level value type: ${typeof user.level}`);
            console.log('---\n');
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUserData();
