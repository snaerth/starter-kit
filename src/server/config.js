// Eviromental variables
import dotenv from 'dotenv';
dotenv.config();

export default() => {
    return {
        // Defaults
        NODE_ENV : process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3000,
        HOST: process.env.HOST || 'localhost',
        // Api
        APIPORT: process.env.APIPORT || 3030,
        APIHOST: process.env.APIHOST || 'localhost'
    };
};