import Nodemailer from 'nodemailer'

module.exports = {
    //Used for Mailing
    async nodeMailer(toEmail, subject, message) {
        
        try {
            const transporter = Nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: '"ProjectZeros"',
                to: toEmail,
                subject: subject, // Subject line
                text: 'ProjectZeros', // plain text body
                html: message // html body
            };
            const info = await transporter.sendMail(mailOptions)
            return info
        } catch (error) {
            Log.error(error);
            throw error;
        }
    }
}
