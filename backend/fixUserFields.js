const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixUserFields = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartsprint';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Fix all users - ensure team and level are set properly
        const users = await User.find({});
        
        console.log(`Found ${users.length} users to check`);
        
        for (const user of users) {
            let needsUpdate = false;
            const updates = {};
            
            // Set defaults for Admin
            if (user.role === 'Admin') {
                if (user.team !== 'admin') {
                    updates.team = 'admin';
                    needsUpdate = true;
                }
                if (user.level !== 'admin') {
                    updates.level = 'admin';
                    needsUpdate = true;
                }
            }
            
            // Set defaults for Project Manager
            if (user.role === 'Project Manager') {
                if (user.team !== 'PM') {
                    updates.team = 'PM';
                    needsUpdate = true;
                }
                if (user.level !== 'PM') {
                    updates.level = 'PM';
                    needsUpdate = true;
                }
            }
            
            if (needsUpdate) {
                // Use updateOne to bypass pre-save hooks
                await User.updateOne({ _id: user._id }, { $set: updates });
                console.log(`✓ Fixed user: ${user.username} (${user.role})`);
            } else {
                console.log(`✓ User OK: ${user.username} (${user.role})`);
            }
        }
        
        console.log('\n✓ All users fixed successfully!');
        
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixUserFields();
