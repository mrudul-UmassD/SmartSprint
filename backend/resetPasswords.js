const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const resetAllPasswords = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartsprint';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB\n');

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users\n`);

        for (const user of users) {
            // Set password based on role
            let newPassword;
            if (user.username === 'admin') {
                newPassword = 'admin123';
            } else {
                newPassword = 'password123';
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            
            // Update user directly in database to bypass pre-save hooks
            await User.updateOne(
                { _id: user._id },
                { 
                    $set: { 
                        password: hashedPassword,
                        isFirstLogin: true
                    } 
                }
            );
            
            console.log(`✓ Reset password for: ${user.username} (${user.role})`);
        }

        console.log('\n✓ All passwords reset successfully!');
        console.log('\nCredentials:');
        console.log('  admin: admin123');
        console.log('  All others: password123');
        
        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAllPasswords();
