const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const debugLogin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartsprint';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB\n');

        const testUsername = 'frontend_junior';
        const testPassword = 'password123';

        console.log(`Testing login for: ${testUsername}`);
        console.log(`Password: ${testPassword}\n`);

        // Find user
        const user = await User.findOne({ username: testUsername });
        
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log('✓ User found in database');
        console.log(`  Username: ${user.username}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Team: ${user.team}`);
        console.log(`  Level: ${user.level}`);
        console.log(`  Password hash: ${user.password}`);
        console.log('');

        // Test password comparison
        console.log('Testing password comparison...');
        
        // Method 1: Using user.comparePassword
        try {
            const isMatch1 = await user.comparePassword(testPassword);
            console.log(`  comparePassword method: ${isMatch1}`);
        } catch (error) {
            console.log(`  comparePassword error: ${error.message}`);
        }

        // Method 2: Direct bcrypt compare
        try {
            const isMatch2 = await bcrypt.compare(testPassword, user.password);
            console.log(`  Direct bcrypt.compare: ${isMatch2}`);
        } catch (error) {
            console.log(`  bcrypt.compare error: ${error.message}`);
        }

        // Test with wrong password
        console.log('\nTesting with wrong password...');
        const wrongPassword = 'wrongpassword123';
        try {
            const isMatch3 = await bcrypt.compare(wrongPassword, user.password);
            console.log(`  Wrong password result: ${isMatch3}`);
        } catch (error) {
            console.log(`  Error: ${error.message}`);
        }

        // Test manual hash creation
        console.log('\nCreating new hash for comparison...');
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(testPassword, salt);
        console.log(`  New hash: ${newHash}`);
        const testNewHash = await bcrypt.compare(testPassword, newHash);
        console.log(`  New hash works: ${testNewHash}`);

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLogin();
