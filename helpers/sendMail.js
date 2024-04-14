import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

const { META_URL_FROM, META_URL_PASSWORD, UKR_NET_PASSWORD,
UKR_NET_FROM  } = process.env;

const nodemailerConfig = {
    // host: "smtp.meta.ua",
    host: "smtp.ukr.net",
    port: 465, // 25, 465, 2525
    secure: true,
    auth: {
        // user: META_URL_FROM,
        // pass: META_URL_PASSWORD,
        user: UKR_NET_FROM,
        pass: UKR_NET_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);
 

const sendEmail = data => {
    const email = { ...data, from: UKR_NET_FROM };
    return transport.sendMail(email);
}

export default sendEmail;