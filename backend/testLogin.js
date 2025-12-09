const axios = require('axios');

const testLogin = async () => {
    try {
        const API_URL = 'http://localhost:5000/api';
        
        console.log('Testing login functionality...\n');
        
        // Test users
        const testUsers = [
            { username: 'admin', password: 'admin123' },
            { username: 'frontend_junior', password: 'password123' },
            { username: 'pm1', password: 'password123' }
        ];
        
        for (const user of testUsers) {
            console.log(`Testing: ${user.username}`);
            try {
                const response = await axios.post(`${API_URL}/auth/login`, {
                    username: user.username,
                    password: user.password
                });
                
                console.log(`✓ ${user.username} - Login successful`);
                console.log(`  Role: ${response.data.user.role}`);
                console.log(`  Team: ${response.data.user.team}`);
                console.log(`  Level: ${response.data.user.level}`);
                console.log(`  Full user object:`, JSON.stringify(response.data.user, null, 2));
            } catch (error) {
                console.log(`✗ ${user.username} - Login failed`);
                if (error.response) {
                    console.log(`  Status: ${error.response.status}`);
                    console.log(`  Error: ${error.response.data.error}`);
                } else {
                    console.log(`  Error: ${error.message}`);
                }
                console.log('');
            }
        }
        
    } catch (error) {
        console.error('Test error:', error.message);
    }
};

testLogin();
