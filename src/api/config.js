// Eviromental variables
import dotenv from 'dotenv';
dotenv.config();

export default() => {
    return {
        // Database
        DB_URL: process.env.DB_URL || 'mongodb://localhost/movieapi',
        DB_USERNAME: process.env.DB_USERNAME || 'username',
        DB_PASSWORD: process.env.DB_PASSWORD || 'password',
        // Passport
        JWT_SECRET: process.env.JWT_SECRET || 'secret',
        // API keys
        API_KEY_KVIKMYNDIR: process.env.API_KEY_KVIKMYNDIR || 'hM2FNPx23my7MD31JIABZQ58Xt2JZKhW',
        API_KEY_TMDB: process.env.API_KEY_TMDB || '6d539e03e2069fa892b57ec2a7234e71',
        // Api defaults
        APIPORT: process.env.APIPORT || 3030,
        APIHOST: process.env.APIHOST || 'localhost'
    };
};