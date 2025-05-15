import { createTransport } from 'nodemailer';
import { configDotenv } from 'dotenv';
configDotenv();

const USER = process.env.USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

const transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: USER,
        pass: APP_PASSWORD
    }
});

//@desc autoREply handler
const autoReply = async (email) =>{
    const mailOptions={
        from:{
            name:'SPINE AUTO REPLY',
            address:USER
        },
        to: email,
        subject: "SPINE HEALTH CARE AUTO REPLY",
        text:"HELLO , we have recived your email and we will contact you soon"

    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Auto-reply sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
    };
};
    
//@desc handle contact form
//@route POST /api/mail/contact
export const contactForm = async (req, res) => {
    const { firstName,lastName, email, subject, message } = req.body;
    if (!firstName || !email ||!lastName|| !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const mailOptions = {
        from: email,
        to: USER,
        subject: `Contact Form: ${subject}`,
        text: `Name: ${firstName+" "+lastName}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${firstName+" "+lastName}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Message sent successfully!" });
        await autoReply(email);
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

