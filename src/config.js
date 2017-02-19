// Eviromental variables
import dotenv from 'dotenv';
dotenv.config();

export default() => {
    return {
        // Defaults
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3000,
        HOST: process.env.HOST || 'localhost',
        // Api
        APIPORT: process.env.APIPORT || 3030,
        APIHOST: process.env.APIHOST || 'localhost',
        // Database
        DB_URL: process.env.DB_URL || 'mongodb://localhost/movieapi',
        DB_USERNAME: process.env.DB_USERNAME || 'username',
        DB_PASSWORD: process.env.DB_PASSWORD || 'password',
        // Passport
        JWT_SECRET: process.env.JWT_SECRET || 'secret',
        // API keys
        API_KEY_KVIKMYNDIR: process.env.API_KEY_KVIKMYNDIR || 'hM2FNPx23my7MD31JIABZQ58Xt2JZKhW',
        API_KEY_TMDB: process.env.API_KEY_TMDB || '6d539e03e2069fa892b57ec2a7234e71',
    };
};