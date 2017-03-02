"use strict";
import nodemailer from 'nodemailer';
import xoauth2 from 'xoauth2';
import config from '../../config';

const {USERNAME, CLIENTID, CLIENTSECRET, REFRESHTOKEN} = config;
const generator = xoauth2.createXOAuth2Generator({user: USERNAME, clientId: CLIENTID, clientSecret: CLIENTSECRET, refreshToken: REFRESHTOKEN});

/**
 * Sends email to requested recipient
 *
 * @param {String} to - Email string
 * @param {String} subject - Email subject
 * @param {String} text - Email text
 * @param {String} html - Email html string
 * @param {Function} callback - Callback function
 * @author Snær Seljan Þóroddsson
 */
export default function sendMail(to, subject, text, html, callback) {
    // Create transport
    const transporter = nodemailer.createTransport(({
        service: 'gmail',
        auth: {
            xoauth2: generator
        }
    }));

    // Email options
    const mailOptions = {
        from: USERNAME,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error, info);
        }

        callback(null, info);
    });
}