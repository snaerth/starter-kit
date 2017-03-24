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
        DB_URL: process.env.DB_URL || 'mongodb://starterkit:starterkit@ds161159.mlab.com:61159/starterkit',
        DB_USERNAME: process.env.DB_USERNAME || 'username',
        DB_PASSWORD: process.env.DB_PASSWORD || 'password',
        // Passport
        JWT_SECRET: process.env.JWT_SECRET || 'secret',
        // Express session
        SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
        // Email
        EMAIL_USERNAME: process.env.EMAIL_USERNAME || '',
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
        // Google Recaptcha
        RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || '6Ld3NBoUAAAAAIcGj92iDd8O4pOZxB3j4hufgijG',
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '6Ld3NBoUAAAAAJ0_HGIZbYR1d80zZX3vQOpmx1Yc'
    };
};